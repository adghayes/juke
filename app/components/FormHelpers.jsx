import { useState } from "react";

export function inputReducer(state, editedFields) {
  return {
    ...state,
    ...editedFields,
  };
}

export function errorReducer(state, { fieldError, inputError }) {
  if (inputError) return inputError;
  return {
    ...state,
    ...fieldError,
  };
}

export function TextField({
  type,
  name,
  label,
  info,
  value,
  inputDispatch,
  errors,
  syncErrors,
  autoComplete,
}) {
  const [touch, setTouch] = useState(false);

  return (
    <label className="flex flex-col font-medium">
      <span className="inline-flex items-center">
        <span>{label}</span>
        {info ? <Info info={info} /> : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        className={`pl-1 mt-1 border-b-2 border-gray-300 relative
                    focus:border-black hover:border-gray-500 w-56 text-sm`}
        onChange={(e) => {
          inputDispatch({ [name]: e.target.value });
          if (touch && syncErrors) syncErrors(e.target.value);
        }}
        onBlur={(e) => {
          if (syncErrors) syncErrors(e.target.value);
          setTouch(true);
        }}
      />
      <Errors messages={touch && errors ? errors : []} />
    </label>
  );
}

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

export function Errors({ message }) {
  return (
    <div className="h-8 pl-2 bg-transparent">
      {message ? (
        <strong className="text-red-700 font-medium text-xs whitespace-wrap">
          {message}
        </strong>
      ) : null}
    </div>
  );
}

export function SubmitButton({ disabled, value }) {
  return (
    <input
      className={
        "text-sm text-white font-medium px-6 py-2 whitespace-nowrap w-min " +
        (disabled
          ? "bg-gray-200"
          : "bg-blue-400 transition duration-300 hover:bg-blue-600 focus:bg-blue-600 hover:shadow cursor-pointer")
      }
      type="submit"
      value={value}
      disabled={disabled}
    />
  );
}

const maxLength = 160;

export function TextArea({ label, name, value, placeholder, inputDispatch }) {
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
        onChange={(e) => inputDispatch({ [name]: e.target.value })}
        maxLength={maxLength}
      />
      <span className="self-end text-xs">
        {value.length}/{maxLength}
      </span>
    </label>
  );
}
