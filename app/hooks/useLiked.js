import { useContext, useEffect, useState } from "react"
import { like, unlike } from "../lib/api-track"
import { SetAlertContext } from "../pages/_app"

export default function useLiked(user, track){
    const setAlert = useContext(SetAlertContext)
    const [numLikes, setNumLikes] = useState(null)
    useEffect(() => {
        if(track){
            setNumLikes(track.num_likes)
        }
      }, [track])
    
    if (!track) return [undefined, () => {}]
    if (!user) return [undefined, () => {
        setAlert('Get an account so we can keep track of the songs you like!')
    }, numLikes]

    const liked  = user.liked_track_ids.includes(track.id)

    if (liked){
        return [true, () => {
            unlike(track)
            setNumLikes(numLikes - 1)
        }, numLikes]
    } else {
        return [false, () => {
            like(track)
            setNumLikes(numLikes + 1)
        }, numLikes]
    }
}
