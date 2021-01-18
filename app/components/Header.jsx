import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useUser from "../hooks/useUser";
import { logout } from "../lib/auth";
import { getAvatar } from "../lib/thumbnails";
import { JukeContext } from "../pages/_app";

function Header() {
  return (
    <header className="fixed w-screen h-11 top-0 z-30 bg-gray-700">
      <nav className="h-full max-w-screen-lg xl:max-w-screen-xl mx-auto flex justify-center items-center">
        <HeaderLogo />
        <ul className="hidden md:flex self-stretch divide-x divide-gray-900 border-r border-gray-900 text-sm">
          <StreamLink />
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
      <a className="block self-stretch bg-gradient-to-t from-purple-500 to-pink-500 px-1.5 flex justify-center">
        <img src="/juke.svg" className="w-15 h-11 z-50" />
      </a>
    </Link>
  );
}

const navLinkBaseClass =
  "block text-gray-200 hover:text-white text-center py-3 self-stretch flex cursor-pointer select-none";

function NavLink({ label, href, onClick, addClass }) {
  const navLinkClass = `${navLinkBaseClass} ${addClass}`;

  return (
    <li className="self-stretch flex justify-center">
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
      <a
        className="contents cursor:pointer"
        href="https://github.com/adghayes/juke"
        target="_blank"
      >
        <input
          disabled
          type="text"
          placeholder="Click for Github"
          value={query}
          onChange={handleChange}
          className="flex-grow text-sm mx-4 md:mx-8 px-2 py-0.5 bg-gray-200 rounded focus:bg-white cursor-pointer"
        />
      </a>
      <FontAwesomeIcon
        icon={faSearch}
        fixedWidth
        className="text-gray-500 absolute h-4  right-5 sm:right-10"
      />
    </div>
  );
}

function StreamLink() {
  return <NavLink label="Stream" href="/stream" addClass="px-6" />;
}

function LibraryLink() {
  const { user } = useUser();
  const { setAlert } = useContext(JukeContext);

  return (
    <NavLink
      label="Library"
      href="/you"
      addClass="px-6"
      onClick={(e) => {
        if (!user) {
          e.preventDefault();
          setAlert({
            message: "Your library is empty because you're not logged in...",
            buttons: true,
          });
        }
      }}
    />
  );
}

function UploadLink() {
  const { user } = useUser();
  const { setAlert } = useContext(JukeContext);

  return (
    <NavLink
      label="Upload"
      href="/upload"
      addClass="px-4"
      onClick={(e) => {
        if (!user) {
          e.preventDefault();
          setAlert({
            message: "Uploading is something you need an account for...",
            buttons: true,
          });
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
          href="/you"
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
        src={getAvatar(user)}
        alt="Your user avatar"
        width="24"
        height="24"
        className="rounded-full"
      />
      <span className="pl-2 truncate max-w-12 md:max-w-8">
        {user.display_name}
      </span>
    </span>
  );
}

function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center h-7">
      <button className="mr-4" onClick={() => setOpen((state) => !state)}>
        <FontAwesomeIcon icon={faBars} fixedWidth className="text-white w-5" />
      </button>
      {open ? (
        <ul
          className={`bg-gray-700 flex flex-col absolute right-0 top-9 text-lg divide-y border-t border-l border-b border-gray-900 divide-gray-900`}
          onClick={() => setOpen(false)}
        >
          <StreamLink />
          <LibraryLink />
          <UploadLink />
          <ProfileLinks padding="px-2" />
        </ul>
      ) : null}
    </div>
  );
}

export default Header;
