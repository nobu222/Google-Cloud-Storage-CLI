const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

const storage = new Storage();
const BUCKET_NAME = process.env.BACKET_NAME;
const OUTPUT_DIR = 'dist';
const downloadFile = async function (srcFilename, destFilename) {
    const options = {
        destination: destFilename,
    };

    fs.mkdirSync(
        destFilename.substr(0, destFilename.lastIndexOf('/')),
        { recursive: true }
    );
    await storage
        .bucket(BUCKET_NAME)
        .file(srcFilename)
        .download(options);

    console.log(
        `gs://${BUCKET_NAME}/${srcFilename} downloaded to ${destFilename}.`
    );
}

storage.bucket(BUCKET_NAME).getFiles().then(
    response => {
        const files = response[0];
        console.log(files.length);
        return Promise.all[
            files.map(file => {
                console.log(`srcFilename: ${file.name}`);
                return downloadFile(file.name, `./${OUTPUT_DIR}/${BUCKET_NAME}/${file.name}`);
            })
        ];
    }
).then(
    results => {
        console.log(JSON.stringify(results, null, 2));
    }
).catch(
    error => console.log(JSON.stringify(error, null, 2))
)
