import { formButtonClass } from "./FormHelpers";

export default function EditProfile() {
  return (
    <div className="self-stretch flex flex-col py-4">
      <div className="self-start flex flex-row justify-start">
        <button type="button" className={formButtonClass + " px-4 py-0.5 mx-4"}>
          Edit
        </button>
      </div>
      <div className="self-center text-3xl text-gray-300 py-8">
        Not Yet Implemented
      </div>
    </div>
  );
}
