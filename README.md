# 📱 WhatsApp Bulk Sender

<div align="center">

![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**Sistema profesional para envío masivo de mensajes de WhatsApp con interfaz web moderna**

[🚀 Características](#-características) • [📋 Instalación](#-instalación) • [🎯 Uso](#-uso) • [⚠️ Importante](#️-importante-uso-responsable)

</div>

---

## 🚀 Características

- ✅ **Interfaz Web Moderna**: Dashboard intuitivo con Bootstrap 5
- ✅ **Conexión WhatsApp Web**: Integración completa con whatsapp-web.js
- ✅ **Envío Masivo**: Soporte para miles de contactos
- ✅ **Personalización**: Variables dinámicas en mensajes ({nombre})
- ✅ **Control de Velocidad**: Retrasos configurables para evitar bloqueos
- ✅ **Progreso en Tiempo Real**: Seguimiento detallado vía WebSockets
- ✅ **Importación CSV**: Carga masiva de contactos desde Excel/CSV
- ✅ **Reportes**: Logs detallados de envíos exitosos y fallidos
- ✅ **Seguridad**: Validaciones y controles anti-spam

## 📋 Requisitos

- Node.js 16 o superior
- NPM o Yarn
- Navegador web moderno
- Cuenta de WhatsApp activa

## 🛠️ Instalación

1. **Clona el proyecto**
   ```bash
   git clone https://github.com/Programacion79/whatsapp-bulk-sender.git
   cd whatsapp-bulk-sender
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor**
   
   **Opción A - Menu Principal (Recomendado):**
   ```bash
   .\menu.bat
   ```
   
   **Opción B - Inicio Completo:**
   ```bash
   .\iniciar-servidor.bat
   ```
   
   **Opción C - Inicio Rápido:**
   ```bash
   .\inicio-rapido.bat
   ```
   
   **Opción D - Manual:**
   ```bash
   npm start
   ```

4. **Abre el navegador**
   ```
   http://localhost:3000
   ```

## 📱 Uso

### 1. Conexión con WhatsApp
- Abre la aplicación en tu navegador
- Escanea el código QR con WhatsApp
- Espera la confirmación de conexión

### 2. Cargar Contactos
- Ve a la sección "Contactos"
- Sube un archivo CSV con formato: `nombre,telefono`
- Verifica la vista previa de contactos

### 3. Configurar Mensaje
- Escribe tu mensaje en la sección "Mensaje"
- Usa `{nombre}` para personalizar
- Ajusta el retraso entre envíos (recomendado: 5 segundos)

### 4. Envío Masivo
- Revisa el resumen en la sección "Enviar"
- Haz clic en "Iniciar Envío Masivo"
- Monitorea el progreso en tiempo real

## 📊 Formato de CSV

El archivo de contactos debe tener el siguiente formato:

```csv
nombre,telefono
Juan Pérez,3001234567
María García,3007654321
Carlos López,3009876543
```

**Importante:**
- Los números deben incluir código de área sin el +
- Para Colombia: usar formato 30XXXXXXXX
- Ajustar código de país en `server.js` según necesidad

## ⚙️ Configuración

### Variables de Entorno

Puedes crear un archivo `.env` para personalizar:

```env
PORT=3000
COUNTRY_CODE=57
DEFAULT_DELAY=5000
MAX_CONTACTS=1000
```

### Personalización de Mensajes

Variables disponibles:
- `{nombre}` - Nombre del contacto
- Puedes agregar más variables modificando el código

## 🔒 Consideraciones de Seguridad

- **Rate Limiting**: El sistema incluye retrasos para evitar bloqueos
- **Validación**: Todos los inputs son validados
- **Límites**: Se recomienda no enviar más de 1000 mensajes por día
- **Contenido**: Evita spam y respeta las políticas de WhatsApp

## 📈 Mejores Prácticas

1. **Velocidad de Envío**
   - Usa al menos 5 segundos entre mensajes
   - Para cuentas nuevas: 10-15 segundos
   - Monitora por posibles bloqueos

2. **Contenido del Mensaje**
   - Personaliza con nombres
   - Mantén mensajes cortos y relevantes
   - Incluye opt-out si es comercial

3. **Horarios**
   - Envía en horarios comerciales
   - Respeta zonas horarias
   - Evita fines de semana para contenido comercial

## 🐛 Solución de Problemas

### Error de Conexión
- Verifica que WhatsApp Web funcione normalmente
- Reinicia el servidor
- Limpia cache del navegador

### Mensajes no se Envían
- Verifica formato de números telefónicos
- Revisa que WhatsApp esté conectado
- Reduce la velocidad de envío

### Error de Memoria
- Reduce el tamaño del lote de contactos
- Reinicia la aplicación periódicamente

## �️ Scripts de Administración

### Scripts Disponibles

| Script | Descripción | Uso |
|--------|-------------|-----|
| `menu.bat` | **Menu principal** con todas las opciones | `.\menu.bat` |
| `iniciar-servidor.bat` | Inicio completo con verificaciones | `.\iniciar-servidor.bat` |
| `inicio-rapido.bat` | Inicio rápido sin verificaciones | `.\inicio-rapido.bat` |
| `auto-reinicio.bat` | Reinicio automático si el servidor falla | `.\auto-reinicio.bat` |
| `monitor.bat` | Monitor del sistema en tiempo real | `.\monitor.bat` |
| `mantenimiento.bat` | Herramientas de mantenimiento y limpieza | `.\mantenimiento.bat` |
| `publicar.bat` | Guía para publicar en producción | `.\publicar.bat` |

### 🎯 Script Recomendado

**Para uso diario, usa el menu principal:**
```bash
.\menu.bat
```

Este script te dará acceso a todas las funciones con una interfaz amigable.

## �📁 Estructura del Proyecto

```
WhatsApp-Bulk-Sender/
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── README.md             # Documentación
├── *.bat                 # Scripts de administración
├── public/               # Archivos estáticos
│   ├── index.html        # Interfaz principal
│   ├── app.js           # JavaScript frontend
│   └── styles.css       # Estilos personalizados
├── plantillas/          # Plantillas CSV
├── uploads/             # Archivos temporales
├── reports/             # Reportes de envío
├── logs/                # Logs del sistema
└── .wwebjs_auth/        # Sesión de WhatsApp (auto-generado)
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## ⚖️ Disclaimer Legal

Este software es para uso educativo y personal. El usuario es responsable de:
- Cumplir con las políticas de WhatsApp
- Respetar leyes de privacidad y spam
- Obtener consentimiento de los destinatarios
- Usar de manera ética y responsable

**No nos hacemos responsables del mal uso de esta herramienta.**

## 📞 Soporte

Si encuentras problemas o tienes sugerencias:
- Abre un issue en GitHub
- Revisa la documentación
- Verifica las mejores prácticas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Desarrollado con ❤️ para automatizar tus comunicaciones de WhatsApp!**