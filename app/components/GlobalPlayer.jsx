

function GlobalPlayer(props){
    return (
        <footer className="player gunmetal">
            <p>Player Here</p>
            <style jsx>{`
                .player {
                    position: fixed;
                    bottom: 0px;
                    width: 100%;
                    height: 48px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    color: white;
                    border-top: thin solid black;
                }
            `}</style>
        </footer>
    )
}

export default GlobalPlayer