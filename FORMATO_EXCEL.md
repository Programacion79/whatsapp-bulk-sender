# 📊 FORMATO DE EXCEL PARA CONTACTOS

## 📋 FORMATO BÁSICO (Requerido)

### Columnas obligatorias:
- **nombre**: Nombre completo del contacto
- **telefono**: Número de teléfono (formato: 30XXXXXXXX para Colombia)

### Ejemplo básico:
```
| nombre        | telefono    |
|---------------|-------------|
| Juan Pérez    | 3001234567  |
| María García  | 3007654321  |
```

## 📋 FORMATO COMPLETO (Opcional)

### Columnas adicionales que puedes agregar:
- **empresa**: Nombre de la empresa
- **cargo**: Puesto/cargo del contacto
- **ciudad**: Ciudad de residencia
- **notas**: Observaciones adicionales

### Ejemplo completo:
```
| nombre        | telefono    | empresa      | cargo     | ciudad   | notas           |
|---------------|-------------|--------------|-----------|----------|-----------------|
| Juan Pérez    | 3001234567  | Empresa ABC  | Gerente   | Bogotá   | Cliente VIP     |
| María García  | 3007654321  | Tech Sol     | Developer | Medellín | Contacto técnico|
```

## 📱 FORMATO DE TELÉFONOS

### Para Colombia (código 57):
- ✅ Correcto: `3001234567` (10 dígitos)
- ✅ Correcto: `3151234567` (móvil)
- ✅ Correcto: `6015551234` (fijo Bogotá)
- ❌ Incorrecto: `+57 300 123 4567`
- ❌ Incorrecto: `300-123-4567`

### Para otros países:
Edita el archivo `server.js` en la línea 159:
```javascript
if (!phoneNumber.startsWith('57')) {
    phoneNumber = '57' + phoneNumber; // Cambiar '57' por tu código de país
}
```

## 🔧 CÓMO CREAR EL EXCEL

### Opción 1: Desde CSV
1. Abre Excel
2. Ve a Datos > Obtener datos > Desde archivo > Desde texto/CSV
3. Selecciona uno de los archivos CSV que creé
4. Configura la importación y guarda como .xlsx

### Opción 2: Manual
1. Abre Excel nuevo
2. En la fila 1 escribe los encabezados: `nombre`, `telefono`
3. Completa los datos en las siguientes filas
4. Guarda como CSV (delimitado por comas) para usar en la aplicación

## 📂 ARCHIVOS INCLUIDOS

He creado 2 plantillas para ti:

1. **plantilla_contactos_simple.csv** - Solo nombre y teléfono
2. **plantilla_contactos_completa.csv** - Con campos adicionales

## ⚠️ REGLAS IMPORTANTES

### Formato de datos:
- Sin espacios en blanco al inicio o final
- Sin caracteres especiales en números
- Una persona por fila
- Encabezados en la primera fila

### Límites recomendados:
- **Máximo 1000 contactos** por archivo
- **Máximo 100 mensajes** por hora (para evitar bloqueos)
- **Mínimo 5 segundos** entre mensajes

## 🚀 VARIABLES EN MENSAJES

Puedes usar estas variables en tus mensajes:
- `{nombre}` - Se reemplaza con el nombre del contacto

Ejemplo de mensaje:
```
¡Hola {nombre}!

Esperamos que estés muy bien. 
Queremos invitarte a nuestro evento especial...

Saludos cordiales,
Tu equipo
```

## 💡 CONSEJOS PRO

1. **Segmenta tus listas** por tipo de cliente
2. **Personaliza los mensajes** usando variables
3. **Prueba primero** con 5-10 contactos
4. **Respeta horarios comerciales** (9am - 6pm)
5. **Incluye opción de opt-out** en mensajes comerciales

---

¿Necesitas ayuda con algún formato específico? ¡Dime qué tipo de contactos manejas y te ayudo a optimizar la estructura!