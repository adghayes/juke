import Card from '../components/Card'
import Register from '../components/Register'
import CompleteProfile from '../components/CompleteProfile'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '../components/Logo'


export default function RegisterPage(props) {
  const [visible, setVisible] = useState(true)
  const [phaseIndex, setPhaseIndex] = useState(0)

  const transitionTo = (phaseIndex) => {
    setVisible(false)
    setTimeout(() => {
      setPhaseIndex(phaseIndex)
      setTimeout(() => {
        setVisible(true)
      }, 100)
    }, 500)
  }

  const phases = [
    <Register callback={ () => transitionTo(1) }/>,
    <CompleteProfile callback={ () => transitionTo(2) }/>,
    <GetStarted />
  ]

  return (
    <main className="min-h-full min-w-full bg-gradient-to-br from-pink-300 to-blue-300 flex justify-center items-center">
        <Card visible={visible}>
          { phases[phaseIndex] }
        </Card>
    </main>
  )
}

function GetStarted(){
  return (
    <div className="flex flex-col justify-center items-center">
      
      <Link href="/stream">
        <a className={`z-50 relative px-4 sm:px-8 py-4 text-black font-bold flex flex-row items-center ` +
          `bg-white py-2 rounded-xl transition transform hover:scale-110 w-max`}>
          <img src="/jukeColor.svg" alt="Juke Logo" className="w-24 sm:w-32"/> 
          <p className="text-2xl sm:text-5xl">Get Listening</p>
        </a>
      </Link>
    </div>
  )
}
