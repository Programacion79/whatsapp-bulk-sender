const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });

// Cliente de WhatsApp simplificado para mejor rendimiento
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

let qrCodeData = '';
let clientReady = false;
let sendingProgress = {
    total: 0,
    sent: 0,
    failed: 0,
    current: '',
    isRunning: false
};

// Eventos del cliente de WhatsApp
client.on('qr', async (qr) => {
    console.log('QR Code generado - listo para escanear');
    try {
        qrCodeData = await qrcode.toDataURL(qr);
        io.emit('qr', qrCodeData);
        console.log('QR Code enviado al navegador');
    } catch (error) {
        console.error('Error generando QR:', error);
        io.emit('qr_error', { message: 'Error generando código QR' });
    }
});

client.on('ready', () => {
    console.log('Cliente de WhatsApp listo!');
    clientReady = true;
    io.emit('ready', { message: 'WhatsApp conectado correctamente' });
});

client.on('authenticated', () => {
    console.log('Autenticado correctamente');
    io.emit('authenticated', { message: 'Sesión autenticada' });
});

client.on('auth_failure', (msg) => {
    console.error('Error de autenticación:', msg);
    io.emit('auth_failure', { message: 'Error de autenticación: ' + msg });
});

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    clientReady = false;
    io.emit('disconnected', { message: 'Desconectado: ' + reason });
});

// Rutas de la API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', (req, res) => {
    res.json({
        ready: clientReady,
        qr: qrCodeData,
        progress: sendingProgress
    });
});

app.post('/api/upload-contacts', upload.single('contactsFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const contacts = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            // Columnas básicas requeridas: nombre, telefono
            if (data.nombre && data.telefono) {
                const contact = {
                    name: data.nombre.trim(),
                    phone: data.telefono.toString().trim()
                };
                
                // Agregar campos adicionales si existen (nombres largos)
                if (data.cargo_aplicado) contact.cargo_aplicado = data.cargo_aplicado.trim();
                if (data.experiencia) contact.experiencia = data.experiencia.trim();
                if (data.nivel_educacion) contact.nivel_educacion = data.nivel_educacion.trim();
                if (data.disponibilidad) contact.disponibilidad = data.disponibilidad.trim();
                if (data.email) contact.email = data.email.trim();
                if (data.fecha_aplicacion) contact.fecha_aplicacion = data.fecha_aplicacion.trim();
                if (data.estado_proceso) contact.estado_proceso = data.estado_proceso.trim();
                if (data.empresa) contact.empresa = data.empresa.trim();
                
                // Agregar campos adicionales (nombres cortos)
                if (data.cargo) contact.cargo = data.cargo.trim();
                if (data.estado) contact.estado = data.estado.trim();
                
                contacts.push(contact);
            }
        })
        .on('end', () => {
            // Limpiar archivo temporal
            fs.unlinkSync(filePath);
            res.json({ 
                message: 'Contactos cargados correctamente',
                count: contacts.length,
                contacts: contacts
            });
        })
        .on('error', (error) => {
            console.error('Error procesando CSV:', error);
            res.status(500).json({ error: 'Error procesando el archivo CSV' });
        });
});

app.post('/api/send-bulk', async (req, res) => {
    if (!clientReady) {
        return res.status(400).json({ error: 'WhatsApp no está conectado' });
    }

    if (sendingProgress.isRunning) {
        return res.status(400).json({ error: 'Ya hay un envío en progreso' });
    }

    const { contacts, message, delay = 10000 } = req.body;

    // LÍMITES DE SEGURIDAD PROFESIONAL
    if (contacts.length > 50) {
        return res.status(400).json({ 
            error: 'LÍMITE DE SEGURIDAD: Máximo 50 contactos por envío para evitar baneo. Divide tu lista en grupos más pequeños.' 
        });
    }

    if (delay < 8000) {
        return res.status(400).json({ 
            error: 'LÍMITE DE SEGURIDAD: Mínimo 8 segundos entre mensajes para uso profesional seguro.' 
        });
    }

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'Lista de contactos inválida' });
    }

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Inicializar progreso
    sendingProgress = {
        total: contacts.length,
        sent: 0,
        failed: 0,
        current: '',
        isRunning: true
    };

    res.json({ message: 'Envío iniciado', total: contacts.length });

    // Enviar mensajes de forma asíncrona
    sendBulkMessages(contacts, message, parseInt(delay));
});

async function sendBulkMessages(contacts, message, delay) {
    const results = [];

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        sendingProgress.current = `${contact.name} (${contact.phone})`;

        try {
            // Formatear número de teléfono
            let phoneNumber = contact.phone.replace(/\D/g, '');
            if (!phoneNumber.startsWith('57')) {
                phoneNumber = '57' + phoneNumber; // Código de Colombia, ajustar según país
            }
            phoneNumber += '@c.us';

            // Personalizar mensaje con múltiples variables
            let personalizedMessage = message.replace(/{nombre}/g, contact.name);
            
            // Variables adicionales disponibles (nombres largos)
            if (contact.cargo_aplicado) {
                personalizedMessage = personalizedMessage.replace(/{cargo}/g, contact.cargo_aplicado);
            }
            if (contact.experiencia) {
                personalizedMessage = personalizedMessage.replace(/{experiencia}/g, contact.experiencia);
            }
            if (contact.empresa) {
                personalizedMessage = personalizedMessage.replace(/{empresa}/g, contact.empresa);
            }
            if (contact.estado_proceso) {
                personalizedMessage = personalizedMessage.replace(/{estado}/g, contact.estado_proceso);
            }
            
            // Variables adicionales (nombres cortos)
            if (contact.cargo) {
                personalizedMessage = personalizedMessage.replace(/{cargo}/g, contact.cargo);
            }
            if (contact.estado) {
                personalizedMessage = personalizedMessage.replace(/{estado}/g, contact.estado);
            }

            // Enviar mensaje
            await client.sendMessage(phoneNumber, personalizedMessage);
            
            sendingProgress.sent++;
            results.push({
                contact: contact,
                status: 'success',
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            console.log(`✓ Mensaje enviado a ${contact.name} (${contact.phone})`);

        } catch (error) {
            sendingProgress.failed++;
            results.push({
                contact: contact,
                status: 'failed',
                error: error.message,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            console.error(`✗ Error enviando a ${contact.name}:`, error.message);
        }

        // Emitir progreso
        io.emit('progress', sendingProgress);

        // Esperar antes del siguiente envío
        if (i < contacts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Finalizar
    sendingProgress.isRunning = false;
    sendingProgress.current = 'Completado';

    // Guardar reporte
    const reportPath = `reports/report_${moment().format('YYYYMMDD_HHmmss')}.json`;
    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    io.emit('completed', {
        ...sendingProgress,
        reportPath: reportPath
    });

    console.log('Envío masivo completado');
}

app.get('/api/stop-sending', (req, res) => {
    sendingProgress.isRunning = false;
    res.json({ message: 'Envío detenido' });
});

// Socket.IO para actualizaciones en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    // Enviar estado actual
    socket.emit('status', {
        ready: clientReady,
        qr: qrCodeData,
        progress: sendingProgress
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Inicializar cliente de WhatsApp
console.log('Iniciando cliente de WhatsApp...');
client.initialize();

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Esperando conexión con WhatsApp...');
});

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});