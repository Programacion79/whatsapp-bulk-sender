# 🚀 Guía de Despliegue en Producción

## 📋 Preparación Previa

Antes de desplegar, asegúrate de tener:
- ✅ Cuenta en la plataforma elegida (Heroku, Railway, Render)
- ✅ Git configurado correctamente
- ✅ Código actualizado en GitHub

---

## 🔥 Opción 1: Heroku (Recomendado)

### **Paso 1: Instalar Heroku CLI**
```bash
# Windows (usando chocolatey)
choco install heroku-cli

# O descargar desde: https://devcenter.heroku.com/articles/heroku-cli
```

### **Paso 2: Login y crear aplicación**
```bash
heroku login
heroku create tu-whatsapp-sender
```

### **Paso 3: Configurar variables de entorno**
```bash
heroku config:set NODE_ENV=production
heroku config:set MAX_CONTACTS_PER_BATCH=50
heroku config:set MESSAGE_DELAY_MIN=8000
heroku config:set MESSAGE_DELAY_MAX=15000
heroku config:set ALLOWED_ORIGINS=https://tu-whatsapp-sender.herokuapp.com
```

### **Paso 4: Desplegar**
```bash
git add .
git commit -m "Configuración para producción"
git push heroku main
```

### **Paso 5: Abrir aplicación**
```bash
heroku open
```

---

## ⚡ Opción 2: Railway

### **Paso 1: Crear cuenta en Railway**
- Ve a https://railway.app
- Regístrate con GitHub

### **Paso 2: Conectar repositorio**
1. Haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio `whatsapp-bulk-sender`

### **Paso 3: Configurar variables**
En Railway Dashboard → Variables:
```
NODE_ENV=production
MAX_CONTACTS_PER_BATCH=50
MESSAGE_DELAY_MIN=8000
MESSAGE_DELAY_MAX=15000
PORT=3000
```

### **Paso 4: Deploy automático**
Railway desplegará automáticamente tu aplicación.

---

## 🎨 Opción 3: Render

### **Paso 1: Crear cuenta en Render**
- Ve a https://render.com
- Regístrate con GitHub

### **Paso 2: Crear Web Service**
1. Dashboard → "New" → "Web Service"
2. Conecta con GitHub y selecciona tu repo
3. Configuración:
   - **Name**: whatsapp-bulk-sender
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### **Paso 3: Variables de entorno**
En Environment:
```
NODE_ENV=production
MAX_CONTACTS_PER_BATCH=50
MESSAGE_DELAY_MIN=8000
MESSAGE_DELAY_MAX=15000
```

---

## 🔒 Configuraciones de Seguridad

### **Variables de Entorno Importantes:**
```bash
NODE_ENV=production                    # Modo producción
MAX_CONTACTS_PER_BATCH=50             # Límite de contactos
MESSAGE_DELAY_MIN=8000                # Retraso mínimo (8s)
MESSAGE_DELAY_MAX=15000               # Retraso máximo (15s)
ALLOWED_ORIGINS=https://tu-dominio.com # URLs permitidas
```

### **Límites Recomendados:**
- 📧 **Máximo 50 contactos por lote**
- ⏱️ **Retraso mínimo 8 segundos entre mensajes**
- 🛡️ **Rate limiting activado**
- 🔐 **CORS configurado para tu dominio**

---

## 📱 Consideraciones para WhatsApp

### **⚠️ Importante:**
1. **Primera conexión**: Necesitarás escanear el código QR
2. **Sesión persistente**: La sesión se guarda automáticamente
3. **Reconexión**: El sistema se reconecta automáticamente
4. **Límites**: Respeta los límites para evitar bloqueos

### **🔄 Mantenimiento de Sesión:**
- La sesión de WhatsApp se mantiene entre reinicios
- Si pierdes la sesión, simplemente escanea el QR nuevamente
- El sistema detecta desconexiones y reintenta automáticamente

---

## 🎯 URLs de tu Aplicación

Después del despliegue, tu aplicación estará disponible en:

**Heroku**: `https://tu-whatsapp-sender.herokuapp.com`
**Railway**: `https://tu-proyecto.up.railway.app`
**Render**: `https://tu-whatsapp-sender.onrender.com`

---

## 🐛 Solución de Problemas

### **Error de conexión WhatsApp:**
```bash
# Ver logs
heroku logs --tail  # Heroku
# O revisar logs en dashboard de Railway/Render
```

### **Error de memoria:**
- Considera upgrade del plan si es necesario
- Railway: Pro plan ($5/mes)
- Render: Starter plan ($7/mes)
- Heroku: Basic plan ($7/mes)

### **Sesión perdida:**
1. Ve a la URL de tu app
2. Escanea el nuevo código QR
3. La sesión se guardará automáticamente

---

## 💡 Recomendaciones Finales

1. **🔒 Haz tu repositorio privado** si contiene datos sensibles
2. **📊 Monitorea el uso** para evitar exceder límites
3. **🔄 Mantén backups** de configuraciones importantes
4. **📱 Usa números de prueba** antes de envío masivo
5. **⚖️ Cumple términos de WhatsApp** para evitar bloqueos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de la plataforma
2. Verifica las variables de entorno
3. Asegúrate de que WhatsApp esté conectado
4. Contacta soporte de la plataforma si es necesario