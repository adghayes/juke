import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "@hookform/error-message";

export function inputReducer(state, editedFields) {
  return {
    ...state,
    ...editedFields,
  };
}

export const labelClass =
  "flex flex-row items-center justify-start py-1 mt-2 mb-1";
export const textInputClass =
  "border-b hover:bg-gray-100 mb-2 text-sm focus:ring-2 focus:rounded px-1 py-0.5";
export const formButtonClass =
  "text-white transition duration-300 bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 hover:shadow cursor-pointer outline-none";

export function Info({ info }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <i
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`bg-gray-300 text-xs rounded-full text-white text-center 
                    w-min px-1.5 mx-1 hover:bg-gray-400 font-serif font-bold`}
      >
        {"i"}
      </i>
      <p
        className={`absolute text-xs z-30 left-16 -top-2 bg-white shadow-lg 
                w-48 h-max p-4 rounded-xl border-2 border-gray-300 border 
                transition transform duration-700 ease-in-out ${
                  open
                    ? "opacity-100 scale-1 text-black"
                    : "opacity-0 scale-0 text-white -translate-x-1/2 -translate-y-1/2"
                }`}
      >
        {info}
      </p>
    </div>
  );
}

export function Error({ errors, name }) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="text-xs text-red-700 whitespace-wrap">{message}</p>
      )}
    />
  );
}

export function SubmitButton({ disabled, label }) {
  return (
    <button
      className={`self-center flex justify-center items-center ${
        disabled ? "pl-1.5 pr-3" : "px-6"
      } py-2 my-4 ${formButtonClass}`}
      type="submit"
      disabled={disabled}
    >
      {disabled ? (
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-white w-5 px-1 animate-spin"
        />
      ) : null}
      <span className="text-sm text-white font-medium">{label}</span>
    </button>
  );
}

const maxLength = 160;

export function TextArea({ label, name, value, setValue, placeholder }) {
  return (
    <label className="flex flex-col">
      <span className="inline-flex items-center py-1 font-medium">{label}</span>
      <textarea
        value={value}
        cols="30"
        rows="6"
        placeholder={placeholder}
        className={
          "resize-none border border-gray-500 px-2 py-1 hover:bg-white bg-gray-100 rounded-xl " +
          "text-xs focus:outline-none focus:border-black focus:bg-white mx-1"
        }
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
      />
      <span className="self-end text-xs">
        {value.length}/{maxLength}
      </span>
    </label>
  );
}
