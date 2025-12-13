# GTFS Validator

Validador de archivos GTFS que procesa archivos ZIP comprimidos y genera reportes detallados de validación.

## Características

- ✅ Descomprime automáticamente archivos ZIP GTFS
- ✅ Valida todos los archivos requeridos del estándar GTFS
- ✅ Verifica estructura y formato de cada archivo
- ✅ Genera reportes detallados en formato texto plano
- ✅ Limpia automáticamente los archivos temporales
- ✅ Soporta todos los archivos opcionales del estándar GTFS

## Instalación

```bash
npm install
```

## Uso

### Uso básico
```bash
node index.js archivo_gtfs.zip
```

### Ejemplo
```bash
node index.js transit_data.zip
```

## Archivos GTFS Validados

### Archivos Requeridos
- `agency.txt` - Información de las agencias de transporte
- `stops.txt` - Paradas y estaciones
- `routes.txt` - Rutas de transporte
- `trips.txt` - Viajes programados
- `stop_times.txt` - Horarios de parada
- `calendar.txt` - Calendario de servicio
- `calendar_dates.txt` - Fechas excepcionales

### Archivos Opcionales
- `fare_attributes.txt` - Atributos de tarifas
- `fare_rules.txt` - Reglas de tarifas
- `shapes.txt` - Formas de rutas
- `frequencies.txt` - Frecuencias de servicio
- `transfers.txt` - Transferencias
- `pathways.txt` - Pasillos y conexiones
- `levels.txt` - Niveles
- `feed_info.txt` - Información del feed
- `translations.txt` - Traducciones
- `attributions.txt` - Atribuciones

## Validaciones Realizadas

### Validaciones Generales
- Verificación de archivos requeridos
- Validación de encabezados de columnas
- Detección de campos no reconocidos

### Validaciones Específicas
- **Coordenadas geográficas**: Validación de rangos (-90 a 90 para latitud, -180 a 180 para longitud)
- **Tipos de ruta**: Verificación de valores válidos (0-7)
- **Calendario**: Validación de valores binarios (0 o 1)
- **Fechas excepcionales**: Verificación de tipos de excepción (1 o 2)

## Reporte de Validación

La aplicación genera un archivo `gtfs_validation_report.txt` con:

1. **Resumen ejecutivo**
   - Total de archivos analizados
   - Archivos válidos/inválidos
   - Total de errores y advertencias

2. **Detalle por archivo**
   - Estado de validación
   - Líneas procesadas
   - Lista detallada de errores
   - Lista de advertencias

## Estructura del Proyecto

```
gtfs-validator/
├── index.js              # Script principal
├── zipExtractor.js       # Manejo de descompresión ZIP
├── gtfsValidator.js      # Lógica de validación GTFS
├── reportGenerator.js    # Generación de reportes
├── package.json          # Dependencias del proyecto
└── README.md            # Este archivo
```

## Dependencias

- `yauzl` - Descompresión de archivos ZIP
- `csv-parser` - Lectura de archivos CSV
- `fs-extra` - Operaciones adicionales del sistema de archivos

## Ejemplo de Salida

```
============================================================
REPORTE DE VALIDACIÓN DE ARCHIVOS GTFS
============================================================

Archivo procesado: transit_data.zip
Fecha y hora de validación: 11/12/2025 15:30:45

RESUMEN EJECUTIVO
----------------------------------------
Total de archivos analizados: 8
Archivos válidos: 7
Archivos inválidos: 1
Total de errores encontrados: 3
Total de advertencias: 2

ESTADO GENERAL: INVÁLIDO - Se encontraron errores críticos
```

## Licencia

MIT