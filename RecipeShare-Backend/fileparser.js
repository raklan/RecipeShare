require('dotenv').config();
const formidable = require('formidable');
const { Transform } = require('stream');
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client, S3 } = require('@aws-sdk/client-s3');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const parsefile = async (req) => {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 100 * 1024 * 1024, //100 MBs converted to bytes,
            allowEmptyFiles: false
        }

        const form = new formidable.Formidable(options);
        
        form.parse(req, (err, fields, files) => {});

        form.on('error', error => {
            reject(error.message)
        })
        
        form.on('data', data => {
            if (data.name === "complete") {
                resolve(data.value);
            }
        })
        
        form.on('fileBegin', (formName, file) => {
            file.open = async function () {
                this._writeStream = new Transform({
                    transform(chunk, encoding, callback) {
                        callback(null, chunk)
                    }
                })

                this._writeStream.on('error', e => {
                    form.emit('error', e)
                });
                
                // upload to S3
                new Upload({
                    client: new S3Client({
                        credentials: {
                            accessKeyId,
                            secretAccessKey
                        },
                        region
                    }),
                    params: {
                        Bucket,
                        Key: `${Date.now().toString()}-${this.originalFilename}`,
                        Body: this._writeStream
                    },
                    tags: [], // optional tags
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false, // optional manually handle dropped parts
                })
                    .done()
                    .then(data => {
                        form.emit('data', { name: "complete", value: data });
                    }).catch((err) => {
                        form.emit('error', err);
                    })
            }
            
            file.end = function (cb) {
                this._writeStream.on('finish', () => {
                    this.emit('end')
                    cb()
                })
                this._writeStream.end()
            }

        })

        
    })
}

const getFile = async (req, res) => {
    try{
        const imageId = req.params.imageId
        var s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        })
        var params = { Bucket: Bucket, Key: imageId}
        const image = await s3.getObject(params);
        image.Body.pipe(res);
    }catch(e){
        res.status(404).end();
    }
}

const deleteFile = async (req, res) => {
    const imageId = req.params.imageId
    var s3 = new S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    })
    var params = { Bucket: Bucket, Key: imageId}
    const response = await s3.deleteObject(params);
    res.status(204).end();
}

module.exports = {parsefile, getFile, deleteFile};