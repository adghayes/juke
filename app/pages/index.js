import WaveformPlayer from '../components/WaveformPlayer.jsx'

export default function Home() {
  const spotlightTextClass = "p-6 text-2xl text-center"
  return (
    <main>
      <section className="relative splash">
        <img src="/guitar-man.jpg" alt="man playing guitar above his head in black and white" />
        <p className="absolute top-12 inset-x-1/4 text-white text-5xl leading-tight">Find and share music on <strong>Noisepuff</strong></p>
      </section>
      <section className="border-l-2 border-r-2 border-b-2 border-black p-6 mb-5 flex flex-col justify-center items-center">
        <p className={spotlightTextClass}>Today's Spotlight: <i>something</i> by <i>someone</i> </p>
        <WaveformPlayer/>
        <p className={spotlightTextClass}>Tomorrow's Spotlight: your music?</p>
      </section> 
    </main>
  )
}
