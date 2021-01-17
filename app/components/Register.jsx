import { signUp } from "../lib/auth";
import { Info, SubmitButton } from "./FormHelpers";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import API from "../lib/api";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const displayInfo =
  "Your Display Name is what other people see when you post or repost tracks, " +
  "and also what appears in your public URL";

const labelClass = "flex flex-row items-center justify-start py-1 mt-2 mb-1";
const textInputClass = "border-b mb-2 text-sm";
const errorClass = "text-xs text-red-700 whitespace-wrap";

function Register({ callback }) {
  const { register, handleSubmit, getValues, formState } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      "user.name": "",
      "user.email": "",
      "user.password": "",
      "confirm-password": "",
    },
  });

  const { errors } = formState;

  async function onSubmit(data, e) {
    e.preventDefault();
    console.log("onSubmit");
    await signUp(data)
      .then(() => {
        callback();
      })
      .catch((err) => {
        const inputError = err.info;
        inputError.displayName = inputError.display_name;
        errorDispatch({ inputError });
      });
  }

  useEffect(() => {
    const id = setInterval(() => {
      window.formState = formState;
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <form
      id="register"
      className="flex flex-col items-stretch px-8 py-4 bg-white rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="self-stretch flex flex-row items-center justify-center">
        <span className="font-bold text-2xl px-2 ">JOIN</span>
        <img src="/jukeColor.svg" alt="Juke Logo" className="w-32" />
      </h1>

      <label htmlFor="user.display_name" className={labelClass}>
        <span>Display Name</span>
        <Info info={displayInfo} />
      </label>
      <input
        className={textInputClass}
        type="text"
        autoComplete="username"
        name="user.display_name"
        ref={register({
          required: "Required",
          minLength: { value: 3, message: "Minimum Length: 3" },
          maxLength: { value: 24, message: "Maximum Length: 3" },
          validate: async (value) => {
            const json = await API.fetch(`users/exists?display_name=${value}`);
            console.log(json);
            return !json.exists || "That display name is taken :(";
          },
        })}
      />
      <ErrorMessage
        errors={errors}
        name="user.display_name"
        render={({ message }) => <p className={errorClass}>{message}</p>}
      />

      <label htmlFor="user.email" className={labelClass}>
        Email
      </label>
      <input
        className={textInputClass}
        type="text"
        autoComplete="email"
        name="user.email"
        ref={register({
          required: "Required",
          pattern: { value: emailRegex, message: "Invalid Email" },
          validate: async (value) => {
            const json = await API.fetch(`users/exists?email=${value}`);
            console.log(json);
            return !json.exists || "Already in use. Log in instead?";
          },
        })}
      />
      <ErrorMessage
        errors={errors}
        name="user.email"
        render={({ message }) => <p className={errorClass}>{message}</p>}
      />

      <label htmlFor="user.password" className={labelClass}>
        Password
      </label>
      <input
        className={textInputClass}
        type="password"
        autoComplete="new-password"
        name="user.password"
        ref={register({
          required: "Required",
          minLength: { value: 8, message: "Minimum Length: 8" },
        })}
      />
      <ErrorMessage
        errors={errors}
        name="user.password"
        render={({ message }) => <p className={errorClass}>{message}</p>}
      />

      <label htmlFor="confirm-password" className={labelClass}>
        Confirm Password
      </label>
      <input
        className={textInputClass}
        type="password"
        autoComplete="new-password"
        name="confirm-password"
        ref={register({
          validate: (value) =>
            value === getValues("user.password") || "Passwords don't match",
        })}
      />
      <ErrorMessage
        errors={errors}
        name="confirm-password"
        render={({ message }) => <p className={errorClass}>{message}</p>}
      />
      <input
        className={`self-center text-sm text-white font-medium px-6 py-2 my-4 whitespace-nowrap transition duration-300 bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 hover:shadow cursor-pointer`}
        type="submit"
        value="Submit"
      />
      <span className="text-sm text-center">
        Already have an account?
        <Link href="/login">
          <a className="px-3 hover:underline focus:underline focus:outline-none font-bold whitespace-nowrap">
            Log In
          </a>
        </Link>
      </span>
    </form>
  );
}

export default Register;
