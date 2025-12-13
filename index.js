#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const ZipExtractor = require('./zipExtractor');
const GTFSValidator = require('./gtfsValidator');
const ReportGenerator = require('./reportGenerator');

class GTFSProcessor {
    constructor() {
        this.zipExtractor = new ZipExtractor();
        this.validator = new GTFSValidator();
        this.reportGenerator = new ReportGenerator();
    }

    async processGTFSZip(zipFilePath) {
        console.log('🚀 Iniciando procesamiento de archivo GTFS...');
        console.log(`📁 Archivo a procesar: ${zipFilePath}`);
        
        try {
            const exists = await fs.pathExists(zipFilePath);
            if (!exists) {
                throw new Error(`El archivo ZIP no existe: ${zipFilePath}`);
            }

            const stats = await fs.stat(zipFilePath);
            if (!zipFilePath.toLowerCase().endsWith('.zip')) {
                throw new Error('El archivo debe tener extensión .zip');
            }

            console.log(`📊 Tamaño del archivo: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            console.log('📦 Extrayendo archivos del ZIP...');

            const extractedFiles = await this.zipExtractor.extractZip(zipFilePath);
            console.log(`✅ Se extrajeron ${extractedFiles.length} archivos`);

            console.log('🔍 Validando estructura y formato de archivos GTFS...');
            const validationResults = await this.validator.validateAllFiles(extractedFiles);
            
            console.log('📋 Generando reporte de validación...');
            const zipFileName = path.basename(zipFilePath);
            const reportContent = this.reportGenerator.generateReport(validationResults, zipFileName);
            
            const reportFileName = await this.reportGenerator.saveReport(reportContent, zipFileName);
            
            const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
            const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);
            
            console.log('\n' + '='.repeat(60));
            console.log('📊 RESUMEN DE VALIDACIÓN');
            console.log('='.repeat(60));
            console.log(`✅ Archivos procesados: ${validationResults.length}`);
            console.log(`❌ Errores encontrados: ${totalErrors}`);
            console.log(`⚠️  Advertencias: ${totalWarnings}`);
            console.log(`📄 Reporte guardado en: ${reportFileName}`);
            
            if (totalErrors === 0) {
                console.log('🎉 ¡El archivo GTFS es válido!');
            } else {
                console.log('❌ El archivo GTFS contiene errores que deben ser corregidos.');
            }
            
            console.log('='.repeat(60));

            return {
                success: true,
                totalErrors,
                totalWarnings,
                reportFileName,
                validationResults
            };

        } catch (error) {
            console.error('❌ Error durante el procesamiento:', error.message);
            return {
                success: false,
                error: error.message
            };
        } finally {
            console.log('🧹 Limpiando archivos temporales...');
            await this.zipExtractor.cleanup();
            console.log('✅ Limpieza completada.');
        }
    }
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Uso: node index.js <archivo_zip_gtfs>');
        console.log('Ejemplo: node index.js gtfs_data.zip');
        process.exit(1);
    }

    const zipFilePath = args[0];
    const processor = new GTFSProcessor();
    
    const result = await processor.processGTFSZip(zipFilePath);
    
    if (!result.success) {
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error fatal:', error);
        process.exit(1);
    });
}

module.exports = GTFSProcessor;