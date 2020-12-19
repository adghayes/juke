import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons'
import { useState, useEffect } from 'react'
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
            <NavLink label="Stream" href="/" padding="px-6" border="border-r-2"/>
            <NavLink label="Library" href="/" padding="px-6" border="border-r-2"/>
        </ul>
    )
}

function SearchBar(props){
    let [query, setQuery] = useState('')

    function handleChange(e){
        setQuery(e.target.value)
    }

    return (
        <input type="text" placeholder="Search" value={query} onChange={handleChange}
            className="w-full mx-8 px-3 py-0.5 bg-gray-200 rounded focus:bg-white"/>
    )
}

function ProfileNav(props){
    const { user, loggedOut, loadingUser } = useUser()

    return (
        <ul className="h-full flex">
            <NavLink label="Upload" href="/" padding="px-4" border="border-l-2 border-r-2"/>
            {
                loggedOut ? (
                    <>
                        <NavLink label="Sign Up" href="/register" padding="px-4" border="border-r-2"/>
                        <NavLink label="Log In" href="/login" padding="px-4" border="border-r-2"/>
                    </>
                ) : (
                    <>
                        <NavLink label="Profile" href="/" padding="px-4" border="border-r-2"/>
                        <NavLink onClick={logout} label="Log Out" href="/" padding="px-4" border="border-r-2"/>
                    </>
                )
            }
        </ul>
    )
}

function NavLink({label, onClick, href, padding, border}){
    return (
        <li className="link h-full">
            <Link href={href}>
                <a className={`block h-full text-gray-200 hover:text-white 
                    text-center text-sm align-middle leading-none py-4 ${padding}
                    whitespace-nowrap ${border} border-gray-900`}
                    onClick={onClick}>
                    {label}</a>
            </Link>
        </li>
    )
}

export default Header