import Link from "next/link";

export default function AccountAlert({ alert, close }) {
  return (
    <div
      className={
        `z-40 fixed -top-8 left-1/2 transform-gpu -translate-x-1/2 transition-transform duration-1000 bg-white p-2 shadow-xl ` +
        `rounded-xl flex flex-col items-center justify-around ${
          !!alert ? "translate-y-full" : "opacity-0 -translate-y-full"
        }`
      }
    >
      <button
        type="button"
        className="self-end text-3xl leading-4"
        onClick={close}
      >
        <p>&times;</p>
      </button>
      <p className="px-4 py-2 text-center">{alert && alert.message}</p>
      {alert && alert.buttons ? (
        <div className="flex flex-row items-center justify-center py-2 px-1">
          <Link href="/login">
            <a
              className="flex justify-center items-center w-24 h-10 px-2 py-1 border-2 border-pink-500 mx-1 text-gray-900 font-bold hover:bg-gray-300 focus:bg-gray-300"
              onClick={close}
            >
              <span>Log In</span>
            </a>
          </Link>
          <Link href="/register">
            <a
              className="flex justify-center items-center w-24 h-10 px-2 py-1 bg-pink-500 text-white font-bold mx-1 hover:bg-pink-900 focus:bg-pink-900"
              onClick={close}
            >
              <span>Sign Up</span>
            </a>
          </Link>
        </div>
      ) : (
        <div className="h-3 w-5"> </div>
      )}
    </div>
  );
}
