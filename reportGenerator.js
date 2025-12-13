const fs = require('fs-extra');
const path = require('path');

class ReportGenerator {
    constructor() {
        this.reportFileName = 'gtfs_validation_report.txt';
        this.fileOrder = [
            // Archivos obligatorios
            'agency.txt',
            'routes.txt', 
            'trips.txt',
            'stop_times.txt',
            
            // Archivos condicionalmente obligatorios
            'stops.txt',
            'calendar.txt',
            'calendar_dates.txt',
            'levels.txt',
            'feed_info.txt',
            
            // Archivos condicionalmente prohibidos
            'networks.txt',
            'route_networks.txt',
            
            // Archivos de tarifas
            'fare_attributes.txt',
            'fare_rules.txt',
            'timeframes.txt',
            'rider_categories.txt',
            'fare_media.txt',
            'fare_products.txt',
            'fare_leg_rules.txt',
            'fare_leg_join_rules.txt',
            'fare_transfer_rules.txt',
            
            // Archivos de ubicación y rutas
            'areas.txt',
            'stop_areas.txt',
            'shapes.txt',
            'location_groups.txt',
            'location_group_stops.txt',
            'locations.geojson',
            
            // Archivos de servicios y transferencias
            'frequencies.txt',
            'transfers.txt',
            'pathways.txt',
            'booking_rules.txt',
            
            // Archivos de metadatos
            'translations.txt',
            'attributions.txt'
        ];
    }

    generateReport(validationResults, zipFileName) {
        const timestamp = new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Ordenar resultados según el orden predefinido
        const orderedResults = this.orderValidationResults(validationResults);

        let report = '=' .repeat(80) + '\n';
        report += 'REPORTE DE VALIDACIÓN DE ARCHIVOS GTFS\n';
        report += '=' .repeat(80) + '\n\n';
        
        report += `Archivo procesado: ${zipFileName}\n`;
        report += `Fecha y hora de validación: ${timestamp}\n\n`;

        const totalFiles = validationResults.length;
        const validFiles = validationResults.filter(r => r.isValid).length;
        const invalidFiles = totalFiles - validFiles;
        const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
        const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);

        report += 'RESUMEN EJECUTIVO\n';
        report += '-'.repeat(40) + '\n';
        report += `Total de archivos analizados: ${totalFiles}\n`;
        report += `Archivos válidos: ${validFiles}\n`;
        report += `Archivos inválidos: ${invalidFiles}\n`;
        report += `Total de errores encontrados: ${totalErrors}\n`;
        report += `Total de advertencias: ${totalWarnings}\n\n`;

        if (invalidFiles > 0) {
            report += 'ESTADO GENERAL: INVÁLIDO - Se encontraron errores críticos\n\n';
        } else if (totalWarnings > 0) {
            report += 'ESTADO GENERAL: VÁLIDO CON ADVERTENCIAS\n\n';
        } else {
            report += 'ESTADO GENERAL: VÁLIDO - Todos los archivos cumplen el estándar\n\n';
        }

        report += 'DETALLE POR ARCHIVO\n';
        report += '=' .repeat(80) + '\n\n';

        orderedResults.forEach((result, index) => {
            report += `${index + 1}. ARCHIVO: ${result.fileName}\n`;
            report += '-'.repeat(50) + '\n';
            report += `Estado: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}\n`;
            report += `Total de líneas procesadas: ${result.totalLines || 0}\n`;
            report += `Cantidad de errores: ${result.errors.length}\n`;
            report += `Cantidad de advertencias: ${result.warnings.length}\n\n`;

            if (result.errors.length > 0) {
                report += 'ERRORES ENCONTRADOS:\n';
                result.errors.forEach((error, errorIndex) => {
                    report += `  ${errorIndex + 1}. ${error}\n`;
                });
                report += '\n';
            }

            if (result.warnings.length > 0) {
                report += 'ADVERTENCIAS:\n';
                result.warnings.forEach((warning, warningIndex) => {
                    report += `  ${warningIndex + 1}. ${warning}\n`;
                });
                report += '\n';
            }

            if (result.errors.length === 0 && result.warnings.length === 0) {
                report += '✓ No se encontraron problemas en este archivo.\n\n';
            }

            report += '\n';
        });

        report += '=' .repeat(80) + '\n';
        report += 'FIN DEL REPORTE\n';
        report += '=' .repeat(80) + '\n';

        return report;
    }

    orderValidationResults(validationResults) {
        // Crear mapa de resultados por nombre de archivo
        const resultMap = new Map();
        validationResults.forEach(result => {
            resultMap.set(result.fileName, result);
        });

        const orderedResults = [];

        // Primero agregar archivos en el orden predefinido
        this.fileOrder.forEach(fileName => {
            if (resultMap.has(fileName)) {
                orderedResults.push(resultMap.get(fileName));
                resultMap.delete(fileName);
            }
        });

        // Luego agregar archivos faltantes en orden alfabético
        const remainingFiles = Array.from(resultMap.keys()).sort();
        remainingFiles.forEach(fileName => {
            orderedResults.push(resultMap.get(fileName));
        });

        return orderedResults;
    }

    async saveReport(reportContent, zipFileName = null) {
        try {
            let fileName = this.reportFileName;
            
            // Si se proporcionó un nombre de archivo zip, incluirlo en el nombre del reporte
            if (zipFileName) {
                const baseName = path.basename(zipFileName, path.extname(zipFileName));
                fileName = `${baseName}_validation_report.txt`;
            }
            
            await fs.writeFile(fileName, reportContent, 'utf8');
            console.log(`Reporte guardado exitosamente en: ${fileName}`);
            return fileName;
        } catch (error) {
            console.error('Error guardando el reporte:', error);
            throw error;
        }
    }

    async saveReportWithCustomName(reportContent, customName) {
        const fileName = customName.endsWith('.txt') ? customName : `${customName}.txt`;
        try {
            await fs.writeFile(fileName, reportContent, 'utf8');
            console.log(`Reporte guardado exitosamente en: ${fileName}`);
            return fileName;
        } catch (error) {
            console.error('Error guardando el reporte:', error);
            throw error;
        }
    }
}

module.exports = ReportGenerator;