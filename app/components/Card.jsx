const transitionOpacity = 'transition-opacity duration-500 ease-in-out'

function Card({ visible, displayNone, children }){
    return (
        <div className={`my-4 ${displayNone ? 'hidden' : ''}
            ${transitionOpacity} ${visible ? 'opacity-100' : 'opacity-0'}`}>
            { children }
        </div>
    )
}

export default Card