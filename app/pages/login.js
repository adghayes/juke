

export default function Home() {
  return (
    <main>
      <form className="white">
        <h2>Log In</h2>
        <label htmlFor="email">Email</label>
        <input id="email" type="text"/>
        <label htmlFor="passsword">Password</label>
        <input id="password" type="password"/>
      </form>
      <style jsx>{`
        main {
          position: relative;
          min-height: 720px;
          background: #F2AD9F;
        }

        form {
          border: thin solid black;
          padding: 16px 24px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 240px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </main>
  )
}