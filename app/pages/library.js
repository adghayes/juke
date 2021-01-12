import useUser from "../hooks/useUser";

export default function Library(){
  const { user, loggedOut } = useUser();

  return (
    <div className="static bg-gradient-to-br from-pink-200 to-purple-300 min-h-screen w-screen">
      <div className="lg:min-w-min max-w-screen-lg xl:max-w-screen-xl mx-auto min-h-screen bg-white flex flex-row justify-between p-4">
        
      </div>
    </div>
  );
}