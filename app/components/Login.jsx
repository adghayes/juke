import { login } from "../lib/auth";
import { useState, useReducer, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { labelClass, textInputClass, SubmitButton, Error } from "./FormHelpers";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState,
  } = useForm();
  const { errors } = formState;
  const [disabled, setDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);

  function onSubmit(data, e) {
    setDisabled(true);
    e.preventDefault();
    login(data.user.email, data.user.password)
      .then(() => {
        Router.replace("/stream");
      })
      .catch(() => {
        setAttempts(attempts + 1);
        setError("credentials", {
          type: "manual",
          message:
            attempts % 2 == 0
              ? `We don't recognize that combination`
              : `Nope...`,
        });
        console.log("sup");
        setDisabled(false);
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col items-stretch px-8 py-4 bg-white rounded-xl`}
    >
      <div className="flex px-2 rounded-full place-items-center">
        <h1 className="font-bold text-2xl px-2">LOGIN</h1>
        <img src="/jukeColor.svg" alt="Juke Logo" className="w-32" />
      </div>
      <div className="self-center">
        <Error errors={errors} name="credentials" />
      </div>
      <label htmlFor="user.email" className={labelClass}>
        Email
      </label>
      <input
        onChange={() => clearErrors()}
        className={textInputClass}
        type="text"
        autoComplete="email"
        name="user.email"
        ref={register}
      />

      <label htmlFor="user.password" className={labelClass}>
        Password
      </label>
      <input
        onChange={() => clearErrors()}
        className={textInputClass}
        type="password"
        autoComplete="current-password"
        name="user.password"
        ref={register}
      />

      <SubmitButton disabled={disabled} label="Log In" />
      <span className="text-sm text-center">
        No Account?
        <Link href="/register">
          <a className="px-3 hover:underline focus:underline focus:outline-none font-bold whitespace-nowrap">
            Sign Up
          </a>
        </Link>
      </span>
    </form>
  );
}

export default Login;
