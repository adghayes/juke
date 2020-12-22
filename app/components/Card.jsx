const center = 'absolute left-1/2 transform -translate-x-1/2 top-1/2 transform -translate-y-1/2'
const transitionOpacity = 'transition-opacity duration-700 ease-in-out'

function Card({ visible, children }){
    return (
        <div className={`${center}  rounded-lg shadow-2xl
            ${transitionOpacity} ${visible ? 'opacity-100' : 'opacity-0'}`}>
            { children }
        </div>
    )
}

export default Card