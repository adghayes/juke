import API from './api'
import { getToken } from './auth'
const directUploadUrl = API.url('rails/active_storage/direct_uploads')

class Uploader {
    constructor(file, handlers) {
        const DirectUpload = require('@rails/activestorage').DirectUpload
        this.upload = new DirectUpload(file, directUploadUrl, this)
        this.onUploadProgress = handlers.onUploadProgress
        this.onUploadSuccess = handlers.onUploadSuccess
    }

    async start() {
        return new Promise( (resolve, reject) => {
            this.upload.create((error, blob) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(blob.signed_id)
                    }
                })
        })
    }

    directUploadWillCreateBlobWithXHR(xhr) {
        xhr.setRequestHeader("Authorization", `bearer ${getToken()}`)
    }

    directUploadWillStoreFileWithXHR(xhr) {
        if(this.onUploadProgress){
            xhr.upload.addEventListener("progress",
                event => this.onUploadProgress(event))
        }

        if(this.onUploadSuccess){
            xhr.upload.addEventListener("load",
                event => this.onUploadSuccess(event))
        }
    }
}

export default Uploader
