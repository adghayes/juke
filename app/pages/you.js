import { redirectUnlessUser } from '../hooks/useRedirect'
import ArtistPage from './[slug]'

export default function You(){
  redirectUnlessUser()

  return <ArtistPage forceUser={true} />
}