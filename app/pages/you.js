import { redirectUnlessUser } from '../hooks/useRedirect'
import ArtistPage from './[artistSlug]'

export default function You(){
  redirectUnlessUser()

  return <ArtistPage forceUser={true} />
}