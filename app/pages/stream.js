import Feed from '../components/Feed'

export default function Stream({ width }) {
  const centerWidth = width > 1280 ? 1280 : width > 1024 ? 1024 : width

  return (
    <div className="mt-11 bg-gradient-to-bl from-red-200 to-purple-300 min-h-screen">
      <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto bg-white min-h-screen flex flex-row justify-around px-4 py-6 ">
        <main className="px-2 flex flex-col items-center w-full sm:w-auto">
          <p className="px-1 text-xl md:text-4xl self-start">Hear the latest tracks on Juke!</p>
          <Feed width={centerWidth * 2 / 3} />
        </main>
        <aside className="hidden lg:flex flex-col mx-2 h-80 bg-blue-500 w-72">
    
        </aside>
      </div>
    </div>
  );
}
