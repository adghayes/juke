import Card from "../components/Card";
import CompleteProfile from "../components/CompleteProfile";
export default function cptest() {
  return (
    <main className="min-h-full min-w-full bg-gradient-to-br from-pink-300 to-blue-300 flex justify-center items-center">
      <Card visible={true}>
        {" "}
        <CompleteProfile />
      </Card>
    </main>
  );
}
