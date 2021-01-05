import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useUser from '../data/useUser'
import { logout } from '../lib/auth'
import { getAvatar } from '../lib/thumbnails'
import Logo from './Logo'

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
                    <a className="block h-full text-white  p-1.5 pt-0">
                        <Logo className="fill-current text-white h-11 w-14"/>
                    </a>
                </Link>
            </li>
            <NavLink label="Stream" action="/" addClass="px-6 border-r"/>
            <NavLink label="Library" action="/" addClass="px-6 border-r"/>
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
    const { loggedOut, loading, user } = useUser()

    return (
        <ul className="h-full flex border-l border-gray-900">
            <NavLink label="Upload" action="/upload" addClass="px-4 border-r hidden md:block"/>
            {
                loggedOut || loading ? (
                    <>
                        <NavLink label="Sign Up" action="/register" addClass="px-4 border-r"/>
                        <NavLink label="Log In" action="/login" addClass="px-4 border-r"/>
                    </>
                ) : (
                    <>
                        <NavLink label={<ProfileLabel user={user}/>} action='/' addClass="px-4 border-r"/>
                        <NavLink label="Log Out" action={logout} addClass="px-4 border-r cursor-pointer"/>
                    </>
                )
            }
        </ul>
    )
}


const navLinkBaseClass = 'block h-full text-gray-200 hover:text-white text-center ' + 
    'text-sm align-middle leading-none py-4 whitespace-nowrap border-gray-900 ' + 
    'flex items-center'

function NavLink({label, action, addClass}){
    const navLinkClass = `${navLinkBaseClass} ${addClass}`

    return (
        <li className="h-full">
        { typeof(action) === 'function' ? (
                <a className={navLinkClass} onClick={action}>
                    {label}
                </a>
        ) : (
                <Link href={action}>
                    <a className={navLinkClass}>
                        {label}
                    </a>
                </Link>
        )}
        </li>
    )
}

function ProfileLabel({user}){
    return (
        <span className="inline-flex items-center justify-center">
            <img src={getAvatar(user.avatar)} alt="Your user avatar" width='24' height='24' className="rounded-full" />
            <span className="pl-2">{user.display_name}</span>
        </span>
    )
}

export default Header