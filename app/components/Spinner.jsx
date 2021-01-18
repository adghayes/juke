export default function Spinner() {
  return (
    <div className="spinner rounded-full w-24 h-24 my-12 border-8 animate-spin">
      <style jsx>{`
        .spinner {
          border-top-color: rgba(236, 72, 153);
        }
      `}</style>
    </div>
  );
}
