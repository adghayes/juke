import Register from '../components/Register'
import CompleteProfile from '../components/CompleteProfile'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import useUser from '../data/useUser'

const fadeOut = 'transition duration-1000 ease-in-out opacity-0'
const fadeIn = 'transition duration-1000 ease-in-out opacity-100'

export default function RegisterPage(props) {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      Router.replace("/");
    }
  }, []);

  const [stage, setStage] = useState('register')
  function accountCreated(){
    setStage('registerFade')
    setTimeout(() => {
      setStage('completeProfile')
    }, 1500)
  }

  function profileCompleted(){
    setStage('')
  }

  return (
    <main className="relative h-screen bg-gradient-to-br from-purple-200 to-pink-300">
    { stage === 'register' || stage === 'registerFade' ? 
      (
        <div className={`absolute left-1/2 transform -translate-x-1/2 
          rounded-lg overflow-hidden shadow-2xl bottom-1/4 ${stage === 'registerFade' ? fadeOut : '' }`}>
            <Register callback={accountCreated}/>
        </div>
      ) : (
        <div className={`absolute left-1/2 transform -translate-x-1/2 
          rounded-lg overflow-hidden shadow-2xl bottom-1/4 ${fadeIn}`}>
          <CompleteProfile callback={profileCompleted}/>
        </div>
      )}
    </main>
  )
}
