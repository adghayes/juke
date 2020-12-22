import WaveformPlayer from '../components/WaveformPlayer.jsx'
import Image from 'next/image'

export default function Home() {
  const spotlightTextClass = "p-6 text-2xl text-center"
  return (
    <main className="max-w-screen-lg mx-auto bg-white">
      <section className="relative splash h-auto">
        <Image
          src="/guitar-man.jpg" 
          alt="Man playing guitar above his head"
          width={1024}
          height={480}
          layout='intrinsic'
          priority={true}
        />
        <p className={`absolute top-14 sm:top-16 left-16 sm:right-1/2 text-white 
          sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight`}>
          Find and share music on{' '}
          <strong>Noisepuff</strong>
        </p>
      </section>
      <section className="border-l-2 border-r-2 border-b-2 border-black p-6 mb-5 flex flex-col justify-center items-center">
        <p className={spotlightTextClass}>Today's Spotlight: <i>something</i> by <i>someone</i> </p>
        <WaveformPlayer/>
        <p className={spotlightTextClass}>Tomorrow's Spotlight: your music?</p>
      </section> 
    </main>
  )
}
