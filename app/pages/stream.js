import Feed from "../components/Feed";
import QueuePreview from "../components/QueuePreview";
import useUser from "../hooks/useUser";

export default function Stream({}) {
  const { user, loggedOut } = useUser();

  return (
    <div className="bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 min-h-screen w-screen">
      <div className="lg:min-w-min max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-row justify-between p-4">
        <main className="p-2 w-full lg:w-auto lg:flex-grow flex flex-col max-w-full items-start">
          <p className="p-1 text-xl md:text-4xl self-start">
            Hear the latest tracks on Juke!
          </p>
          <Feed width={null} />
        </main>
        <aside className="hidden lg:block my-8 pl-2 xl:pl-4 border-l">
          <div className="sticky top-0 flex flex-col">
            <QueuePreview
              title="Your Likes"
              length={3}
              queueKey={user && `users/${user.slug}/likes`}
              emptyMessage={ !user ? "gotta be logged in to save your likes... ": "start liking tracks to add them to your library..."}
            />
            <QueuePreview
              title="Recently Played"
              length={3}
              queueKey={user && `users/${user.slug}/history`}
              emptyMessage={ !user ? "gotta be logged in for this too..." : "nothing here yet..."}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
