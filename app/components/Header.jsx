import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useUser from "../hooks/useUser";
import { logout } from "../lib/auth";
import { getAvatar } from "../lib/thumbnails";
import Logo from "./Logo";
import { JukeContext } from "../pages/_app";

function Header() {
  return (
    <header className="fixed w-full h-11 top-0 z-30 bg-gray-700">
      <nav className="h-full max-w-screen-lg xl:max-w-screen-xl mx-auto flex justify-center items-center">
        <HeaderLogo />
        <ul className="hidden md:flex h-full divide-x divide-gray-900 border-r border-gray-900 text-sm">
          <NavLink label="Stream" href="/stream" addClass="px-6" />
          <LibraryLink />
        </ul>
        <SearchBar />
        <ul className="hidden md:flex h-full items-center divide-x divide-gray-900 border-l border-r border-gray-900 text-sm">
          <UploadLink />
          <ProfileLinks padding="px-4" />
        </ul>
        <div className="md:hidden">
          <Dropdown />
        </div>
      </nav>
    </header>
  );
}

function HeaderLogo() {
  return (
    <Link href="/">
      <a className="block h-full bg-gradient-to-t from-purple-500 to-pink-500 pl-1.5 pr-0.5">
        <Logo className="w-16 h-11"/>
      </a>
    </Link>
  );
}

const navLinkBaseClass =
  "block h-full text-gray-200 hover:text-white text-center " +
  "align-middle leading-none py-4 whitespace-nowrap border-gray-900 " +
  "flex items-center cursor-pointer flex justify-center items-center select-none";

function NavLink({ label, href, onClick, addClass }) {
  const navLinkClass = `${navLinkBaseClass} ${addClass}`;

  return (
    <li className="h-full">
      <Link href={href}>
        <a className={navLinkClass} onClick={onClick}>
          {label}
        </a>
      </Link>
    </li>
  );
}

function SearchBar() {
  let [query, setQuery] = useState("");

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <div className="flex flex-grow justify-center items-center relative">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleChange}
        className="text-sm flex-grow mx-6 md:mx-8 px-2 py-0.5 bg-gray-200 rounded focus:bg-white"
      />
      <FontAwesomeIcon
        icon={faSearch}
        fixedWidth
        className="text-gray-500 absolute h-4 right-10"
      />
    </div>
  );
}

function LibraryLink() {
  const { user } = useUser()
  const { setAlert } = useContext(JukeContext)

  return (
    <NavLink 
      label="Library" 
      href="/you" 
      addClass="px-6" 
      onClick={(e) => {
        if(!user){
          e.preventDefault()
          setAlert("Your library is empty because you don't have an account yet...")
        }
      }}
    />
  )
}

function UploadLink() {
  const { user } = useUser()
  const { setAlert } = useContext(JukeContext)

  return (
    <NavLink
      label="Upload"
      href="/upload"
      addClass="px-4"
      onClick={(e) => {
          if(!user){
            e.preventDefault()
            setAlert('Uploading is something you need an account for...')
          }
        }}
    />
  );
}

function ProfileLinks({ padding }) {
  const { loggedOut, loading, user } = useUser();

  if (loggedOut || loading || !user) {
    return (
      <>
        <NavLink label="Sign Up" href="/register" addClass={padding} />
        <NavLink label="Log In" href="/login" addClass={padding} />
      </>
    );
  } else {
    return (
      <>
        <NavLink
          label={<ProfileLabel user={user} />}
          href="/"
          addClass={padding}
        />
        <NavLink
          label="Log Out"
          href="/login"
          onClick={logout}
          addClass={padding}
        />
      </>
    );
  }
}

function ProfileLabel({ user }) {
  return (
    <span className="inline-flex items-center justify-center">
      <img
        src={getAvatar(user.avatar)}
        alt="Your user avatar"
        width="24"
        height="24"
        className="rounded-full"
      />
      <span className="pl-2">{user.display_name}</span>
    </span>
  );
}

function Dropdown(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center h-full">
      <button className="mr-4" onClick={() => setOpen((state) => !state)}>
        <FontAwesomeIcon
          icon={faBars}
          fixedWidth
          className="text-white w-5 h-full right-10"
        />
      </button>
      {open ? (
        <ul
          className={`bg-gray-700 flex flex-col absolute right-0 top-8 text-lg divide-y border-l border-b border-gray-900 divide-gray-900`}
        >
          <NavLink label="Stream" href="/stream" addClass="px-6" />
          <LibraryLink />
          <UploadLink />
          <ProfileLinks />
        </ul>
      ) : null}
    </div>
  );
}

export default Header;
