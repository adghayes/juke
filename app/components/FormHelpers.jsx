import { useState } from "react";
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
    <div className="flex-shrink-0">
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-xs text-red-700 whitespace-wrap">{message}</p>
        )}
      />
    </div>
  );
}

export function SubmitButton({ disabled, label, type }) {
  return (
    <button
      type={type || "submit"}
      className={`self-center flex justify-center items-center ${
        disabled ? "pl-1.5 pr-3" : "px-6"
      } py-2 my-4 ${formButtonClass}`}
      type="submit"
      disabled={disabled}
    >
      {disabled ? (
        <ion-icon name="sync" class="text-white text-lg animate-spin px-0.5" />
      ) : null}
      <span className="text-sm text-white font-medium">{label}</span>
    </button>
  );
}

const maxLength = 160;

export function TextArea({
  value,
  onChange,
  inputRef,
  label,
  name,
  placeholder,
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="inline-flex items-center py-1 font-medium"
      >
        {label}
      </label>
      <textarea
        value={value}
        cols="30"
        rows="6"
        ref={inputRef}
        placeholder={placeholder}
        name={name}
        className={
          "resize-none border hover:bg-gray-100 mb-2 text-sm focus:ring-2 rounded px-1 py-0.5 outline-none"
        }
        onChange={onChange}
        maxLength={maxLength}
      />
      <span className="self-end text-xs">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}

export function TextField({
  name,
  label,
  inputRef,
  type,
  errors,
  autoComplete,
  onChange,
  info,
}) {
  return (
    <>
      <label htmlFor={name} className={labelClass}>
        <span>{label}</span>
        {info ? <Info info={info} /> : null}
      </label>
      <input
        className={textInputClass}
        type={type}
        name={name}
        ref={inputRef}
        autoComplete={autoComplete}
        onChange={onChange}
      />
      {errors ? <Error errors={errors} name={name} /> : null}
    </>
  );
}
