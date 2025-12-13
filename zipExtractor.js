const yauzl = require('yauzl');
const fs = require('fs-extra');
const path = require('path');

class ZipExtractor {
    constructor() {
        this.tempDir = './temp_extracted';
    }

    async extractZip(zipFilePath) {
        return new Promise((resolve, reject) => {
            const extractedFiles = [];
            
            yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    reject(err);
                    return;
                }

                zipfile.readEntry();
                zipfile.on('entry', (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        zipfile.readEntry();
                    } else {
                        const fullPath = path.join(this.tempDir, entry.fileName);
                        const dirPath = path.dirname(fullPath);
                        
                        fs.ensureDirSync(dirPath);
                        
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            
                            readStream.pipe(fs.createWriteStream(fullPath));
                            readStream.on('end', () => {
                                extractedFiles.push(fullPath);
                                zipfile.readEntry();
                            });
                        });
                    }
                });

                zipfile.on('end', () => {
                    resolve(extractedFiles);
                });
            });
        });
    }

    async cleanup() {
        try {
            await fs.remove(this.tempDir);
        } catch (error) {
            console.error('Error limpiando archivos temporales:', error);
        }
    }
}

module.exports = ZipExtractor;