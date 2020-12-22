import CompleteProfile from '../components/CompleteProfile'
import Card from '../components/Card'

export default function LoginPage(props) {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-tr from-blue-200 to-pink-300">
      <Card visible={true}>
        <CompleteProfile/>
      </Card>
    </main>
  )
}
