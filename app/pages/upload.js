import Card from '../components/Card'
import Upload from '../components/Upload'
import { useState } from 'react'
import Uploader from '../lib/uploader'
import { notifyUploadStart, notifyUploadSuccess } from '../lib/apiTrack'


export default function RegisterPage(props) {

  const [visible, setVisible] = useState(true)
  const [phaseIndex, setPhaseIndex] = useState(0)

  const transitionTo = (phaseIndex) => () => {
    setVisible(false)
    setTimeout(() => {
      setPhaseIndex(phaseIndex)
      setTimeout(() => {
        setVisible(true)
      }, 100)
    }, 700)
  }
    
  const [track, setTrack] = useState([])
  const [uploadSizeTotal, setUploadSizeTotal] = useState(0)
  const [uploadSizeLoaded, setUploadSizeLoaded] = useState(0)

  function onUploadSuccess(e){
    setTrack(notifyUploadSuccess(track.id))
  }

  function onUploadProgress(e){
    if(!uploadSizeTotal) setUploadSizeTotal(e.total)
    setUploadSizeLoaded(e.loaded)
    
    console.log('progress ' + e.loaded / e.total)
  }

  async function fileSelected(file){
    const fileUpload = new Uploader(file, { onUploadProgress, onUploadSuccess })
    const blobId = await fileUpload.start()
    setTrack(await notifyUploadStart(blobId))
  }


  const phases = [
    <Upload fileSelected={fileSelected} />
  ]

  return (
    <main className="relative min-h-screen min-w-full bg-gradient-to-tr from-blue-300 via-purple-300 to-red-300">
        <Card visible={visible}>
          { phases[phaseIndex] }
        </Card>
    </main>
  )
}
