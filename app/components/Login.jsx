import Router from "next/router";
import Link from "next/link";

import { login } from "../lib/auth";
import { useContext, useState } from "react";
import { SubmitButton, Error, TextField } from "./FormHelpers";
import { useForm } from "react-hook-form";
import { JukeContext } from "../pages/_app";

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
  const { setAlert } = useContext(JukeContext);

  function onSubmit(data, e) {
    setDisabled(true);
    e.preventDefault();
    login(data.user.email, data.user.password)
      .then(() => {
        Router.replace("/stream");
      })
      .catch((e) => {
        if (e.message === "credentials") {
          setAttempts(attempts + 1);
          setError("credentials", {
            type: "manual",
            message:
              attempts % 2 == 0
                ? `We don't recognize that combination...`
                : `Nope...`,
          });
        } else {
          setAlert({
            message:
              "We're having some trouble connecting to Juke... try again another time please!",
          });
        }
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
      <TextField
        name="user.email"
        label="Email"
        inputRef={register({ required: "Required" })}
        autoComplete="email"
        type="text"
        onChange={() => clearErrors("credentials")}
        errors={errors}
      />
      <TextField
        name="user.password"
        label="Password"
        inputRef={register({ required: "Required" })}
        autoComplete="current-password"
        type="password"
        onChange={() => clearErrors("credentials")}
        errors={errors}
      />
      <SubmitButton disabled={disabled} label="Submit" />
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
