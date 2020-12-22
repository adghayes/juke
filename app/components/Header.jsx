import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useUser from '../data/useUser'
import { logout } from '../lib/auth'

function Header(props){
    return (
        <header className="fixed w-full h-11 top-0 z-30 bg-gray-700">
            <nav className="h-full max-w-screen-lg mx-auto flex justify-between items-center">
                <PageNav/>
                <SearchBar/>
                <ProfileNav {...props}/>
            </nav>
        </header>
    )
}

function PageNav(props){
    return (
        <ul className="h-full flex">
            <li className="h-full logo bg-gradient-to-t from-purple-500 to-pink-500">
                <Link href="/">
                    <a className="block h-full text-white w-16 p-1.5 pt-0">
                        <FontAwesomeIcon icon={faSoundcloud} size="5x"/>
                    </a>
                </Link>
            </li>
            <NavLink label="Stream" href="/" addClass="px-6 border-r"/>
            <NavLink label="Library" href="/" addClass="px-6 border-r"/>
        </ul>
    )
}

function SearchBar(props){
    let [query, setQuery] = useState('')

    function handleChange(e){
        setQuery(e.target.value)
    }

    return (
        <div className="flex flex-grow justify-center items-center relative">
            <input type="text" placeholder="Search" value={query} onChange={handleChange}
                className="w-max text-sm flex-grow mx-8 px-3 py-0.5 bg-gray-200 rounded focus:bg-white hidden sm:block"/>
            <FontAwesomeIcon icon={faSearch} fixedWidth size="xs" color="lightgray" className="absolute h-4 right-10 hidden sm:block"/>
        </div>
    )
}

function ProfileNav(props){
    const { user, loggedOut, loadingUser } = useUser()

    return (
        <ul className="h-full flex border-l border-gray-900">
            <NavLink label="Upload" href="/" addClass="px-4 border-r hidden md:block"/>
            {
                loggedOut ? (
                    <>
                        <NavLink label="Sign Up" href="/register" addClass="px-4 border-r"/>
                        <NavLink label="Log In" href="/login" addClass="px-4 border-r"/>
                    </>
                ) : (
                    <>
                        <NavLink label="Profile" href="/" addClass="px-4 border-r"/>
                        <NavLink onClick={logout} label="Log Out" href="/" addClass="px-4 border-r"/>
                    </>
                )
            }
        </ul>
    )
}

function NavLink({label, onClick, href, padding, border, addClass}){
    return (
        <li className="link h-full">
            <Link href={href}>
                <a className={`block h-full text-gray-200 hover:text-white 
                    text-center text-sm align-middle leading-none py-4 
                    whitespace-nowrap border-gray-900 ${addClass}`}
                    onClick={onClick}>
                    {label}</a>
            </Link>
        </li>
    )
}

export default Header