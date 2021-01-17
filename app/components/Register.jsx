import { signUp } from "../lib/auth";
import {
  Info,
  SubmitButton,
  Error,
  labelClass,
  textInputClass,
} from "./FormHelpers";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import API from "../lib/api";
import { JukeContext } from "../pages/_app";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const displayInfo =
  "Your Display Name is what other people see when you post or repost tracks, " +
  "and also what appears in your public URL";

function Register({ callback }) {
  const { setAlert } = useContext(JukeContext);
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
  const [disabled, setDisabled] = useState(false);

  const checkUnique = (field, message) => async (value) => {
    let json;
    try {
      json = await API.fetch(`users/exists?${field}=${value}`);
    } catch (e) {
      setAlert({ message: "We're having some trouble connecting to Juke..." });
    }
    return !json.exists || message;
  };

  async function onSubmit(data, e) {
    e.preventDefault();
    setDisabled(true);
    console.log("onSubmit");
    await signUp(data).then(() => {
      callback();
    });
  }

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
          validate: checkUnique(
            "display_name",
            "That display name is taken :("
          ),
        })}
      />
      <Error errors={errors} name="user.display_name" />

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
          validate: checkUnique("email", "Already in use. Log in instead?"),
        })}
      />
      <Error errors={errors} name="user.email" />

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
      <Error errors={errors} name="user.password" />

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
      <Error errors={errors} name="confirm-password" />
      <SubmitButton disabled={disabled} label="Submit" />
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
