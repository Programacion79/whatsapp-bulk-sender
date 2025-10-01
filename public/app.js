// Conexión Socket.IO
const socket = io();

// Variables globales
let contacts = [];
let manualContacts = [];
let isConnected = false;

// Elementos DOM
const connectionStatus = document.getElementById('connection-status');
const statusText = document.getElementById('status-text');
const qrContainer = document.getElementById('qr-container');
const contactsForm = document.getElementById('contacts-form');
const contactsPreview = document.getElementById('contacts-preview');
const totalContactsSpan = document.getElementById('total-contacts');
const manualContactsPreview = document.getElementById('manual-contacts-preview');
const manualTotalContactsSpan = document.getElementById('manual-total-contacts');
const messageText = document.getElementById('message-text');
const messagePreview = document.getElementById('message-preview');
const delayInput = document.getElementById('delay-input');
const startSendingBtn = document.getElementById('start-sending');
const stopSendingBtn = document.getElementById('stop-sending');
const progressContainer = document.getElementById('progress-container');

// Eventos Socket.IO
socket.on('connect', () => {
    console.log('Conectado al servidor');
    updateConnectionStatus('connecting', 'Iniciando WhatsApp...');
    qrContainer.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-success mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <h5>Iniciando WhatsApp Web...</h5>
            <p class="text-muted">Esto puede tomar unos segundos</p>
            <div class="progress mt-3" style="height: 20px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" style="width: 30%">Conectando...</div>
            </div>
        </div>
    `;
});

socket.on('qr', (qrData) => {
    console.log('QR Code recibido');
    updateConnectionStatus('connecting', 'Escanea el código QR');
    qrContainer.innerHTML = `
        <div class="text-center">
            <img src="${qrData}" alt="QR Code" class="img-fluid border rounded" style="max-width: 300px;">
            <div class="mt-3">
                <h5 class="text-success">✅ Código QR Listo</h5>
                <p>Escanea este código con WhatsApp</p>
                <small class="text-muted">El código se actualiza automáticamente cada pocos segundos</small>
            </div>
        </div>
    `;
});

socket.on('qr_error', (data) => {
    console.error('Error QR:', data.message);
    qrContainer.innerHTML = `
        <div class="alert alert-danger text-center">
            <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
            <h5>Error generando código QR</h5>
            <p>${data.message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
        </div>
    `;
});

socket.on('ready', (data) => {
    console.log('WhatsApp conectado:', data.message);
    updateConnectionStatus('connected', 'Conectado a WhatsApp');
    qrContainer.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h4>¡Conectado exitosamente!</h4>
            <p>${data.message}</p>
        </div>
    `;
    isConnected = true;
    updateSendButton();
});

socket.on('authenticated', (data) => {
    console.log('Autenticado:', data.message);
});

socket.on('auth_failure', (data) => {
    console.error('Error de autenticación:', data.message);
    updateConnectionStatus('disconnected', 'Error de autenticación');
    qrContainer.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle fa-2x"></i>
            <h5>Error de Autenticación</h5>
            <p>${data.message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
        </div>
    `;
});

socket.on('disconnected', (data) => {
    console.log('Desconectado:', data.message);
    updateConnectionStatus('disconnected', 'Desconectado');
    isConnected = false;
    updateSendButton();
});

socket.on('progress', (progressData) => {
    updateProgress(progressData);
});

socket.on('completed', (data) => {
    console.log('Envío completado:', data);
    progressContainer.style.display = 'block';
    updateProgress(data);
    
    startSendingBtn.style.display = 'block';
    stopSendingBtn.style.display = 'none';
    startSendingBtn.disabled = false;
    
    showAlert('success', `Envío completado! ${data.sent} enviados, ${data.failed} fallidos`);
});

// Funciones de utilidad
function updateConnectionStatus(status, text) {
    const indicator = connectionStatus.querySelector('.status-indicator');
    indicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
}

function updateProgress(progressData) {
    if (!progressData) return;

    const { total, sent, failed, current, isRunning } = progressData;
    const remaining = total - sent - failed;
    const percentage = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-bar').textContent = `${percentage}%`;
    
    document.getElementById('sent-count').textContent = sent;
    document.getElementById('failed-count').textContent = failed;
    document.getElementById('remaining-count').textContent = remaining;
    document.getElementById('total-count').textContent = total;
    document.getElementById('current-contact').textContent = current || '-';

    if (!isRunning) {
        document.getElementById('progress-bar').classList.remove('progress-bar-animated');
    }
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(`${sectionName}-section`).style.display = 'block';
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function updateSendButton() {
    const totalContacts = contacts.length + manualContacts.length;
    const hasContacts = totalContacts > 0;
    const hasMessage = messageText.value.trim() !== '';
    
    startSendingBtn.disabled = !(isConnected && hasContacts && hasMessage);
    
    // Actualizar resumen
    document.getElementById('summary-contacts').textContent = totalContacts;
    document.getElementById('summary-delay').textContent = `${delayInput.value/1000}s`;
    
    const estimatedTime = Math.ceil((totalContacts * parseInt(delayInput.value)) / 60000);
    document.getElementById('summary-time').textContent = `~${estimatedTime}min`;
}

function updateMessagePreview() {
    const message = messageText.value;
    let preview = message
        .replace(/{nombre}/g, '<strong>Ana García</strong>')
        .replace(/{cargo}/g, '<strong>Desarrollador Senior</strong>')
        .replace(/{experiencia}/g, '<strong>5 años</strong>')
        .replace(/{estado}/g, '<strong>Pre-seleccionado</strong>')
        .replace(/\n/g, '<br>');
    messagePreview.innerHTML = preview;
}

function loadMessageTemplate() {
    const template = document.getElementById('message-templates').value;
    const messageTextArea = document.getElementById('message-text');
    
    const templates = {
        citacion: `🎯 ¡Hola {nombre}!

Hemos revisado tu aplicación para el cargo de {cargo} y nos complace informarte que has sido seleccionado(a) para la siguiente fase del proceso.

📅 ENTREVISTA PROGRAMADA:
• Fecha: [INSERTAR FECHA]
• Hora: [INSERTAR HORA]  
• Modalidad: [Presencial/Virtual]
• Ubicación: [DIRECCIÓN O LINK]

📋 Documentos a traer:
• Hoja de vida actualizada
• Cédula de ciudadanía
• Certificados de experiencia

⏰ Por favor confirma tu asistencia respondiendo este mensaje.

¡Esperamos conocerte pronto!

Saludos cordiales,
Equipo de Recursos Humanos`,

        preseleccionado: `✅ ¡Hola {nombre}!

Hemos revisado tu aplicación para el cargo de {cargo} y nos complace informarte que has sido PRE-SELECCIONADO(A).

Con tu experiencia de {experiencia}, consideramos que tienes un perfil muy interesante para nuestro equipo.

📞 Te estaremos contactando en los próximos 2-3 días hábiles para coordinar una entrevista.

Mientras tanto, puedes preparar:
• Tu portafolio profesional
• Referencias laborales
• Expectativas salariales

¡Gracias por tu interés en unirte a nuestro equipo!

Saludos cordiales,
Equipo de RRHH`,

        documentos: `📄 ¡Hola {nombre}!

Como parte del proceso de selección para {cargo}, necesitamos que nos envíes los siguientes documentos:

📋 DOCUMENTOS REQUERIDOS:
✅ Hoja de vida actualizada (PDF)
✅ Cédula de ciudadanía (ambas caras)
✅ Certificados laborales
✅ Diplomas y certificaciones
✅ Referencias laborales (mínimo 2)

📧 Puedes enviarlos al correo: rrhh@empresa.com
📱 O responder a este WhatsApp con los archivos

⏰ PLAZO: 48 horas

¡Gracias por tu colaboración!

Recursos Humanos`,

        seguimiento: `📞 ¡Hola {nombre}!

Te contactamos para hacer seguimiento a tu aplicación para el cargo de {cargo}.

📊 ESTADO ACTUAL: {estado}

Queremos informarte que tu proceso continúa activo y estamos evaluando tu perfil junto con otros candidatos.

📅 Te mantendremos informado(a) sobre los próximos pasos en los siguientes días.

Si tienes alguna pregunta, no dudes en contactarnos.

¡Gracias por tu paciencia!

Saludos,
Equipo de Reclutamiento`,

        seleccionado: `🎉 ¡FELICITACIONES {nombre}!

Nos complace informarte que has sido SELECCIONADO(A) para el cargo de {cargo} en nuestra empresa.

🎯 PRÓXIMOS PASOS:
1️⃣ Proceso de vinculación
2️⃣ Inducción corporativa  
3️⃣ Inicio de labores: [FECHA]

📞 Te contactaremos mañana para coordinar los detalles de tu vinculación.

¡Bienvenido(a) al equipo! Estamos emocionados de trabajar contigo.

🎊 ¡Felicidades una vez más!

Recursos Humanos`,

        personalizado: `¡Hola {nombre}!

[Escribe aquí tu mensaje personalizado]

Puedes usar estas variables:
• {nombre} - Nombre del candidato
• {cargo} - Cargo al que aplica
• {experiencia} - Experiencia
• {estado} - Estado del proceso

Saludos cordiales,
[Tu nombre/empresa]`
    };
    
    if (template && templates[template]) {
        messageTextArea.value = templates[template];
        updateMessagePreview();
    }
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container-fluid').insertBefore(alertDiv, document.querySelector('.row'));
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Event Listeners
contactsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('contactsFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('danger', 'Por favor selecciona un archivo CSV');
        return;
    }
    
    const formData = new FormData();
    formData.append('contactsFile', file);
    
    try {
        const response = await fetch('/api/upload-contacts', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            contacts = result.contacts;
            updateContactsPreview();
            updateSendButton();
            showAlert('success', `${result.count} contactos cargados correctamente`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('danger', 'Error cargando contactos: ' + error.message);
    }
});

function updateContactsPreview() {
    if (contacts.length === 0) {
        contactsPreview.innerHTML = '<p class="text-muted">No hay contactos cargados</p>';
        totalContactsSpan.textContent = '0';
        return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    contacts.slice(0, 10).forEach(contact => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${contact.name}</strong><br>
                    <small class="text-muted">${contact.phone}</small>
                </div>
                <span class="badge bg-primary rounded-pill">✓</span>
            </div>
        `;
    });
    
    if (contacts.length > 10) {
        html += `<div class="list-group-item text-center text-muted">
            ... y ${contacts.length - 10} contactos más
        </div>`;
    }
    
    html += '</div>';
    contactsPreview.innerHTML = html;
    totalContactsSpan.textContent = contacts.length;
}

messageText.addEventListener('input', updateMessagePreview);
delayInput.addEventListener('input', updateSendButton);

startSendingBtn.addEventListener('click', async () => {
    if (!isConnected) {
        showAlert('danger', 'WhatsApp no está conectado');
        return;
    }
    
    const allContacts = [...contacts, ...manualContacts];
    
    if (allContacts.length === 0) {
        showAlert('danger', 'No hay contactos cargados. Agrega contactos manualmente o sube un archivo CSV.');
        return;
    }
    
    if (messageText.value.trim() === '') {
        showAlert('danger', 'El mensaje no puede estar vacío');
        return;
    }
    
    const confirmSend = confirm(`¿Estás seguro de enviar el mensaje a ${allContacts.length} contactos?\n\n` +
        `Contactos del archivo: ${contacts.length}\n` +
        `Contactos manuales: ${manualContacts.length}\n` +
        `Total: ${allContacts.length}`);
    if (!confirmSend) return;
    
    try {
        const response = await fetch('/api/send-bulk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contacts: allContacts,
                message: messageText.value,
                delay: parseInt(delayInput.value)
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            progressContainer.style.display = 'block';
            startSendingBtn.style.display = 'none';
            stopSendingBtn.style.display = 'block';
            
            showAlert('info', 'Envío iniciado correctamente');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('danger', 'Error iniciando envío: ' + error.message);
    }
});

stopSendingBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/stop-sending');
        const result = await response.json();
        
        startSendingBtn.style.display = 'block';
        stopSendingBtn.style.display = 'none';
        startSendingBtn.disabled = false;
        
        showAlert('warning', result.message);
    } catch (error) {
        console.error('Error:', error);
        showAlert('danger', 'Error deteniendo envío');
    }
});

// Funciones para contactos manuales
function addManualContact(contactData) {
    manualContacts.push(contactData);
    updateManualContactsPreview();
    updateSendButton();
}

function updateManualContactsPreview() {
    if (manualContacts.length === 0) {
        manualContactsPreview.innerHTML = '<p class="text-muted">Agrega contactos usando el formulario</p>';
        manualTotalContactsSpan.textContent = '0';
        document.getElementById('clear-all-btn').style.display = 'none';
        return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    manualContacts.forEach((contact, index) => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${contact.name}</strong><br>
                    <small class="text-muted">${contact.phone}</small>
                    ${contact.cargo ? `<br><small class="badge bg-primary">${contact.cargo}</small>` : ''}
                    ${contact.estado ? `<small class="badge bg-success">${contact.estado}</small>` : ''}
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="removeManualContact(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    html += '</div>';
    
    manualContactsPreview.innerHTML = html;
    manualTotalContactsSpan.textContent = manualContacts.length;
    document.getElementById('clear-all-btn').style.display = 'block';
}

function removeManualContact(index) {
    manualContacts.splice(index, 1);
    updateManualContactsPreview();
    updateSendButton();
}

function clearAllManualContacts() {
    if (confirm('¿Estás seguro de eliminar todos los contactos manuales?')) {
        manualContacts = [];
        updateManualContactsPreview();
        updateSendButton();
    }
}

function clearManualForm() {
    document.getElementById('manual-contact-form').reset();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateMessagePreview();
    updateSendButton();
    
    // Event listener para formulario manual
    document.getElementById('manual-contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const cargo = document.getElementById('contact-cargo').value.trim();
        const experiencia = document.getElementById('contact-experiencia').value.trim();
        const estado = document.getElementById('contact-estado').value.trim();
        
        if (!name || !phone) {
            showAlert('danger', 'Nombre y teléfono son obligatorios');
            return;
        }
        
        // Validar formato de teléfono
        if (!/^\d{10}$/.test(phone)) {
            showAlert('danger', 'El teléfono debe tener exactamente 10 dígitos sin espacios ni símbolos');
            return;
        }
        
        const contactData = {
            name: name,
            phone: phone
        };
        
        if (cargo) contactData.cargo = cargo;
        if (experiencia) contactData.experiencia = experiencia;
        if (estado) contactData.estado = estado;
        
        addManualContact(contactData);
        clearManualForm();
        showAlert('success', `Contacto ${name} agregado correctamente`);
    });
});