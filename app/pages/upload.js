import { useState, useEffect } from 'react'

import Card from '../components/Card'
import Upload from '../components/Upload'
import SubmitTrack from '../components/SubmitTrack'
import Uploader from '../lib/uploader'
import { postTrack, notifyUploadSuccess, getTrack } from '../lib/api-track'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function UploadPage(props) {

  const [track, setTrack] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [poll, setPoll] = useState(null)

  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(true)

  const transitionTo = (phase) => {
    setVisible(false)
    setTimeout(() => {
      setPhase(phase)
      setTimeout(() => {
        setVisible(true)
      }, 100)
    }, 500)
  }

  useEffect(async () => {
    if (track){
      if (track.processing === "none" && uploadComplete){

        setTrack(await notifyUploadSuccess(track.id))

      } else if (track.processing === "started" && !poll){

        setPoll(setInterval(async () => {
          console.log('polling')
          setTrack(await getTrack(track.id))
        }, 5000))

      } else if (track.processing !== "started" && poll){
        console.log('done polling')
        clearInterval(poll)
        setPoll(null)
      }
    }

    return () => {
      if(poll) clearInterval(poll)
    }
  }, [track, uploadComplete])


  function onUploadSuccess(e){
    console.log('upload complete')
    setUploadComplete(true)
  }

  function onUploadProgress(e){   
    setUploadProgress(e.loaded / e.total)
  }

  async function fileSelected(file){
    const fileUpload = new Uploader(file, { onUploadProgress, onUploadSuccess })
    const blobId = await fileUpload.start()
    console.log('blob created')
    setTrack(await postTrack({ original: blobId }))
    transitionTo(1)
    console.log('track created')
  }



  return (
    <main className="relative min-h-screen min-w-full bg-gradient-to-tr from-blue-300 via-purple-300 to-red-300">
        <Card visible={visible} displayNone={phase !== 0}>
          <Upload fileSelected={fileSelected}/>,
        </Card>
        <Card visible={visible} displayNone={phase !== 1}>
          <SubmitTrack 
            uploadProgress={uploadProgress} 
            uploadComplete={uploadComplete}
            track={track || {}}
            callback={() => transitionTo(2)}
            />
        </Card>
        <Card visible={visible} displayNone={phase !== 2}>
          <TrackStatus track={track || {}}/>
        </Card>
    </main>
  )
}

function TrackStatus({ track }){
  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-xl p-8">
      <h1 className="text-2xl lg:text-4xl font-bold pb-1">{statusHeader(track.processing)}</h1>
      <p className="pb-8">{statusSubHeader(track.processing)}</p>
      {statusIcon(track.processing)}
    </div>
  )
}

function statusHeader(status){
  switch(status){
    case 'started':
      return "We've got your track"
    case 'error':
      return "Something went wrong, oof"
    case 'done':
      return "We are live!"
    default:
      return "Still uploading..."
  }
}

function statusSubHeader(status){
  switch(status){
    case 'started':
      return "But we're still getting it ready"
    case 'error':
      return "We weren't able to process your upload, sorry about that"
    case 'done':
      return "Your track is up and ready for listening"
    default:
      return "Must be a big track!"
  }
}

function statusIcon(status){
  switch(status){
    case 'error':
      return <FontAwesomeIcon icon={faTimes} color="white" className="bg-red-600 rounded-full p-4 w-32 h-32"/>
    case 'done':
      return <FontAwesomeIcon icon={faCheck} color="white" className="bg-green-600 rounded-full p-4 w-32 h-32"/>
    default:
      return <div className="spinner rounded-full w-32 h-32 border-8 animate-spin">
      <style jsx>{`
        .spinner {
          border-top-color: rgba(236, 72, 153);
        }
      `}</style>
    </div>
  }
}