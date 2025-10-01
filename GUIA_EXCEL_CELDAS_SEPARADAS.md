# 📊 GUÍA: CÓMO ABRIR CSV EN EXCEL CON CELDAS SEPARADAS

## 🎯 PROBLEMA COMÚN
Cuando abres un CSV directamente en Excel, a veces todos los datos aparecen en una sola celda o los acentos se ven mal.

## ✅ SOLUCIÓN CORRECTA

### **MÉTODO 1: Importar desde Excel (RECOMENDADO)**

1. **Abre Excel** (hoja nueva)
2. **Ve a:** Datos → Obtener datos → Desde archivo → Desde texto/CSV
3. **Selecciona** el archivo CSV descargado
4. **En la ventana de vista previa:**
   - Asegúrate que "Separador" esté en **"Coma"**
   - Verifica que "Codificación de archivo" sea **"UTF-8"**
5. **Haz clic en "Cargar"**
6. **¡Listo!** Cada campo estará en su propia celda

### **MÉTODO 2: Asistente de importación**

1. **Abre Excel**
2. **Ve a:** Archivo → Abrir
3. **Selecciona** "Todos los archivos (*.*)" en el filtro
4. **Elige** tu archivo CSV
5. **En el Asistente:**
   - Paso 1: Selecciona "Delimitados"
   - Paso 2: Marca solo "Coma" como separador
   - Paso 3: Haz clic en "Finalizar"

### **MÉTODO 3: Cambiar separador (si Excel usa ;)**

Si tu Excel está configurado para usar ";" como separador:

1. **Abre el archivo CSV** en Notepad
2. **Reemplaza** todas las comas (,) por punto y coma (;)
3. **Guarda** el archivo
4. **Abre** directamente en Excel

## 📋 ESTRUCTURA CORRECTA EN EXCEL

### Cuando lo abras correctamente, verás:

| **A** | **B** | **C** | **D** |
|-------|-------|-------|-------|
| nombre | telefono | cargo_aplicado | estado_proceso |
| Ana Garcia | 3001234567 | Desarrollador Senior | Pre-seleccionado |
| Carlos Rodriguez | 3157654321 | Analista de Datos | Pendiente revision |
| Maria Lopez | 3009876543 | Gerente de Proyectos | Citado entrevista |

### ❌ **INCORRECTO** (todo en una celda):
| **A** |
|-------|
| nombre,telefono,cargo_aplicado,estado_proceso |
| Ana Garcia,3001234567,Desarrollador Senior,Pre-seleccionado |

## 🔧 SOLUCIÓN A CARACTERES ESPECIALES

Si ves "GarcÃ­a" en lugar de "García":

1. **Al importar:** Selecciona codificación **"UTF-8"**
2. **Si ya está abierto:** 
   - Guarda como CSV UTF-8
   - Vuelve a importar con UTF-8

## 💡 TIPS ADICIONALES

- **Siempre usa "Importar"** en lugar de abrir directamente
- **Verifica la vista previa** antes de cargar
- **Guarda como .xlsx** después de importar para mantener el formato
- **No edites** el CSV directamente en Excel si planeas reimportarlo

## 🚀 VENTAJAS DE CELDAS SEPARADAS

✅ **Control total** sobre cada campo  
✅ **Fácil edición** masiva por columnas  
✅ **Filtros y ordenamiento** por cualquier campo  
✅ **Fórmulas** para validar o completar datos  
✅ **Formato condicional** por estado del proceso  

---

**¿Problemas?** Contacta al equipo técnico.