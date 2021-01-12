import Login from '../components/Login'
import Card from '../components/Card'
import { redirectIfUser } from '../hooks/useRedirect';

export default function LoginPage(props) {
  redirectIfUser()

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-indigo-300 to-pink-300">
      <Card visible={true}>
        <Login/>
      </Card>
    </main>
  )
}
