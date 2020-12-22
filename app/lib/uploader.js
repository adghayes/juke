import API from './api'
const directUploadUrl = API.BACKEND + 'rails/active_storage/direct_uploads'

class Uploader {
    constructor(file, progressHandler) {
        const DirectUpload = require('@rails/activestorage').DirectUpload
        this.upload = new DirectUpload(file, directUploadUrl, this)
        this.progressHandler = progressHandler
    }

    async start() {
        return new Promise( (resolve, reject) => {
            this.upload.create((error, blob) => {
                    if (error) {
                        reject(error)
                    } else {
                        console.log(blob)
                        resolve(blob.signed_id)
                    }
                })
        })
    }

    directUploadWillStoreFileWithXHR(request) {
        if(this.progressHandler){
            request.upload.addEventListener("progress",
                event => this.progressHandler(event))
        }
    }
}

export default Uploader