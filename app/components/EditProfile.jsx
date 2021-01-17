import { formButtonClass } from "./FormHelpers";

export default function EditProfile() {
  return (
    <div className="self-stretch flex flex-col items-stretch">
      <div className="flex flex-row justify-start">
        <button type="button" className={formButtonClass + " px-4 py-0.5 mx-4"}>
          Edit
        </button>
      </div>
    </div>
  );
}
