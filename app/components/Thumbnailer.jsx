import AvatarEditor from 'react-avatar-editor'
import React, { useState, useRef, useEffect } from 'react'
import { Info } from './FormHelpers'

const size = 192
const defaultScale = 1
const buttonClass = "relative text-xs my-1 py-0.5 px-1 bg-purple-500 overflow-hidden text-white font-light " +
   "rounded hover:bg-purple-700"

function Thumbnailer({thumbnail, placeholder, inputDispatch}){

    const [editing, setEditing] = useState(false)
    const [scale, setScale] = useState(defaultScale)
    const [border, setBorder] = useState(2)
    const fileInput = useRef(null)
    const editor = useRef(null)

    useEffect(() => {
        setBorder(0)
    }, [])

    function reset(e){
        inputDispatch({thumbnail: null})
        setScale(defaultScale)
    }

    function cancel(e){
        setEditing(false)
        setScale(defaultScale)
    }

    function confirm(){
        editor.current.getImageScaledToCanvas().toBlob(blob => {
            inputDispatch({
                thumbnail: blob
            })
        })
        setEditing(false)
    }

    return (
        <div className="flex flex-col items-center">
            <p className="self-start font-medium">Thumbnail</p>
            <div className="flex flex-row">

                <div className="flex flex-col items-center">
                    <div className={`relative w-min m-1 ${editing ? '' : 'rounded-full overflow-hidden'}`}>
                        <AvatarEditor
                            ref={editor}
                            image={ editing || thumbnail ? fileInput.current.files[0]  : placeholder }
                            width={size}
                            height={size}
                            border={border}
                            borderRadius={size / 2}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={scale}
                            rotate={0}
                        />
                        <div className={`absolute inset-0 opacity-100 z-50 ${editing ? 'hidden' : ''}`}></div>
                    </div>
                    <div className="flex flex-row justify-around w-full">
                        <button type="button" className={`${buttonClass} ${editing ? 'hidden' : ''}`}>
                            Replace
                            <input type="file" ref={fileInput} accept="image/*" 
                                className={'absolute inset-0 z-50 opacity-0 text-xs'} 
                                onChange={ e => setEditing(true)}/>
                        </button>
                        <button type="button" className={`${buttonClass} ${editing || !thumbnail ? 'hidden' : ''}`}
                            onClick={reset}>
                            Reset
                        </button>
                        <button type="button" className={`${buttonClass} ${editing ? '' : 'hidden'}`}
                            onClick={confirm}>
                            Confirm
                        </button>
                        <button type="button" className={`${buttonClass} ${editing ? '' : 'hidden'}`}
                            onClick={cancel}>
                            Cancel
                        </button>
                        <div className={`flex flex-col items-center ${editing ? '' : 'hidden'}`} >
                            <label htmlFor="imageScale" className="text-xs font-medium">Scale</label>
                            <input id="imageScale" type="range" min='0' max='2' step='0.01'  value={scale}
                                onChange={e => setScale(e.target.value)}
                                className="w-16"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Thumbnailer