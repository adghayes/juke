import { useMemo, useRef } from 'react'
import Feed from '../components/Feed'

export default function Stream({ }) {
  return (
    <div className="bg-gradient-to-bl from-red-200 to-purple-300 min-h-full">
      <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-row justify-around p-4">
        <main className="p-2 flex flex-col flex-grow items-center">
          <p className="p-1 text-xl md:text-4xl self-start">Hear the latest tracks on Juke!</p>
          <Feed width={null} />
        </main>
        <aside className="hidden -sm:flex flex-col mx-2 h-80 bg-blue-500 w-72">
    
        </aside>
      </div>
    </div>
  );
}
