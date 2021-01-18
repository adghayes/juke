import { signUp } from "../lib/auth";
import { TextField, SubmitButton } from "./FormHelpers";
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
      json = await API.fetch(
        `users/exists?${field}=${encodeURIComponent(value)}`
      );
      const available = !json.exists;
      return available || message;
    } catch (e) {
      setAlert({
        message:
          "We're having some trouble connecting to Juke... try again another time please!",
      });
    }
    return true;
  };

  async function onSubmit(data, e) {
    e.preventDefault();
    setDisabled(true);
    await signUp({ user: data.user }).then(() => {
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

      <TextField
        name="user.display_name"
        label="Display Name"
        inputRef={register({
          required: "Required",
          minLength: { value: 3, message: "Minimum Length: 3" },
          maxLength: { value: 20, message: "Maximum Length: 3" },
          validate: checkUnique(
            "display_name",
            "That display name is taken :("
          ),
        })}
        autoComplete="off"
        type="text"
        errors={errors}
        info={displayInfo}
      />

      <TextField
        name="user.email"
        label="Email"
        inputRef={register({
          required: "Required",
          pattern: { value: emailRegex, message: "Invalid Email" },
          validate: checkUnique("email", "Already in use. Log in instead?"),
        })}
        autoComplete="email"
        type="email"
        errors={errors}
      />

      <TextField
        name="user.password"
        label="Password"
        inputRef={register({
          required: "Required",
          minLength: { value: 8, message: "Minimum Length: 8" },
        })}
        autoComplete="new-password"
        type="password"
        errors={errors}
      />

      <TextField
        name="confirm-password"
        label="Confirm Password"
        inputRef={register({
          validate: (value) =>
            value === getValues("user.password") || "Passwords don't match",
        })}
        autoComplete="new-password"
        type="password"
        errors={errors}
      />

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
