import { useState } from 'react'
import Dropzone from 'react-dropzone'

const accept = ['.wav', '.flac', '.aiff', '.aif', '.alac', '.mp3', '.aac', '.ogg', '.vorbis',
    '.mp4', '.mp2', '.m4a', '.3gp', '.3g2', '.mj2', '.amr', '.wma']

function Upload({ fileSelected }){
    const [disabled, setDisabled] = useState(false)
    function onDropAccepted(acceptedFiles){ 
        fileSelected(acceptedFiles[0])
    }

    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow-xl">
            <h1 className="text-xl md:text-3xl lg:text-5xl text-bold font-bold py-2 lg:py-4">Upload Your Music</h1>
            <Dropzone 
                onDropAccepted={onDropAccepted}
                accept={accept}
                disabled={disabled}
                maxFiles={1}
                multiple={false}>
                {({getRootProps, getInputProps}) => (
                        <section {...getRootProps()} className={`flex flex-col items-center justify-center focus:outline-none`}>
                                <input {...getInputProps()} />
                                <div className={`flex flex-col items-center justify-center px-20 py-12 md:px-36 md:py-28 lg:px-56 lg:py-44 ` +
                                    `m-1.5 border-black border-dashed border-2 rounded-xl md:text-lg lg:text-xl`}>
                                    <p className="whitespace-nowrap">
                                        Drag and Drop or 
                                    </p>
                                    <button type="button" className={`bg-blue-400 py-1.5 px-6 my-1 text-white ` + 
                                        `font-medium hover:bg-blue-700 focus:bg-blue-700 focus:outline-none`}>Click</button>
                                    <p className="whitespace-nowrap">
                                        to select a file
                                    </p>
                                </div>
                        </section>
                )}
            </Dropzone>
        </div>
    )
}

export default Upload