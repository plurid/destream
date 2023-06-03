#!/usr/bin/env node

// https://github.com/checkly/puppeteer-recorder/blob/master/scripts/zip.js

const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');


const DEST_DIR = path.join(__dirname, '../distribution');
const DEST_ZIP_DIR = path.join(__dirname, '../distribution-zip');


const cleanup = async () => {
    const rmPaths = [
        './assets/.gitkeep',
        'contentscript.js.LICENSE.txt',
        'options.js.LICENSE.txt',
        'popup.js.LICENSE.txt',
    ];

    for (const rmPath of rmPaths) {
        await fs.promises.rm(
            path.join(
                DEST_DIR,
                rmPath,
            ),
        );
    }

    const cleanupFiles = [
        'contentscript.js',
        'options.js',
        'popup.js',
    ];

    for (const cleanupFile of cleanupFiles) {
        const filePath = path.join(
            DEST_DIR,
            cleanupFile,
        );

        const data = await fs.promises.readFile(filePath, 'utf-8');
        const lines = data.split('\n')
        lines.shift();
        const content = lines.join('\n');
        await fs.promises.writeFile(filePath, content);
    }
}

const extractExtensionData = () => {
    const extPackageJson = require('../package.json');

    return {
        name: extPackageJson.name.replace('@plurid/', ''),
        version: extPackageJson.version
    };
}

const makeDestZipDirIfNotExists = () => {
    if (!fs.existsSync(DEST_ZIP_DIR)) {
        fs.mkdirSync(DEST_ZIP_DIR);
    }
}

const buildZip = (src, dist, zipFilename) => {
    console.info(`Building ${zipFilename}...`);

    return new Promise((resolve, reject) => {
        zipFolder(src, path.join(dist, zipFilename), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

const main = async () => {
    await cleanup();

    const {name, version} = extractExtensionData();
    const zipFilename = `${name}-v${version}.zip`;

    makeDestZipDirIfNotExists();

    buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
        .then(() => console.info('OK'))
        .catch(console.err);
}

main();
