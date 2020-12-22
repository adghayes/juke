import Card from '../components/Card'
import Register from '../components/Register'
import CompleteProfile from '../components/CompleteProfile'
import { useState, useLayoutEffect } from 'react'
import Router from 'next/router'
import useUser from '../data/useUser'

export default function RegisterPage(props) {
  const { user } = useUser();
  useLayoutEffect(() => {
    if (user) {
      Router.replace("/");
    }
  }, []);

  const [visible, setVisible] = useState(true)
  const [phaseIndex, setPhaseIndex] = useState(0)

  const transitionTo = (phaseIndex) => () => {
    setVisible(false)
    setTimeout(() => {
      setPhaseIndex(phaseIndex)
      setTimeout(() => {
        setVisible(true)
      }, 500)
    }, 1000)
  }

  const phases = [
    <Register callback={ transitionTo(1) }/>,
    <CompleteProfile callback={() => null}/>
  ]

  return (
    <main className="relative min-h-screen min-w-full bg-gradient-to-br from-pink-300 to-blue-300">
        <Card visible={visible}>
          { phases[phaseIndex] }
        </Card>
    </main>
  )
}
