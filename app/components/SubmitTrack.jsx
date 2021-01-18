import { useContext, useState } from "react";
import { TextArea, SubmitButton, Info, TextField } from "./FormHelpers";
import Thumbnailer, { editingThumbnailAlert } from "./Thumbnailer";
import Uploader from "../lib/uploader";
import { patchTrack } from "../lib/api-track";
import { useForm, Controller } from "react-hook-form";
import { JukeContext } from "../pages/_app";
import { getThumbnail, defaultThumbnail } from "../lib/thumbnails";
import API from "../lib/api";

const processingInfo =
  `We convert your music into formats suitable ` +
  `for streaming. If you enable downloads on your track, however, it is the ` +
  `original that will be downloaded.`;

const processingMessage = {
  none: "",
  started: "Processing...",
  error: "Processing Error!",
  done: "Done Processing",
};

const processingClass = {
  none: "",
  started: "font-bold text-black animate-pulse",
  error: "font-bold text-red",
  done: "font-bold text-gray-500",
};

const downloadInfo =
  `If you check this, other users will be able to download your ` +
  `track with a click!`;

export default function SubmitTrack({ uploadProgress, track, callback }) {
  const { setAlert } = useContext(JukeContext);
  const [disabled, setDisabled] = useState(false);
  const [editingThumbnail, setEditingThumbnail] = useState(false);
  const [thumbnail, setThumbnail] = useState(undefined);
  const { register, formState, control, handleSubmit } = useForm({
    defaultValues: {
      "track.description": "",
      "track.title": "",
      "track.downloadable": false,
    },
  });
  const { errors } = formState;

  const uploadComplete =
    track && ["done", "started", "error"].includes(track.processing);

  async function onSubmit(data, e) {
    e.preventDefault();
    if (editingThumbnail) {
      setAlert(editingThumbnailAlert);
      return;
    }

    const payload = { ...data.track, submitted: true };
    setDisabled(true);
    try {
      payload.thumbnail = thumbnail
        ? await new Uploader(thumbnail).start()
        : thumbnail;
      await patchTrack(payload, track.id);
      setThumbnail(undefined);
      if (callback) callback();
    } catch (e) {
      setAlert({
        message: "Oops, we had a problem updating your data. Try again?",
      });
    }
    setDisabled(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center bg-white rounded-xl shadow-xl px-4 pb-6 pt-2"
    >
      <div className="flex flex-row w-full justify-between text-xs">
        <span
          className={`${
            uploadComplete ? "text-gray-500" : "font-bold text-black"
          }`}
        >
          {uploadComplete ? "Uploaded" : "Uploading..."}
        </span>
        <span className={"inline-flex"}>
          <span className={`${processingClass}`}>
            {track && processingMessage[track.processing]}
          </span>
          {track && track.processing ? <Info info={processingInfo} /> : null}
        </span>
      </div>
      <div className="flex flex-row h-1.5 my-0.5 w-full rounded-full overflow-hidden bg-gray-300 divide-x-2 divide-black">
        <div className="relative w-1/2 h-full">
          <div
            className="bg-indigo-500 absolute top-0 bottom-0 left-0"
            style={{ width: Math.floor(uploadProgress * 100) + "%" }}
          ></div>
        </div>
        <div
          className={`w-1/2 h-full ${uploadComplete ? "bg-pink-500" : ""} ${
            track && track.processing === "started" ? "animate-pulse" : ""
          }`}
        ></div>
      </div>
      <div className="flex flex-col sm:flex-row divide-white py-8 px-4">
        <Thumbnailer
          label="Thumbnail"
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          editing={editingThumbnail}
          setEditing={setEditingThumbnail}
          oldThumbnail={getThumbnail(track)}
          placeholder={defaultThumbnail()}
        />
        <div className="w-16 h-1 self-center"></div>
        <div className="flex flex-col">
          <TextField
            name="track.title"
            label="Title"
            inputRef={register({
              required: "Required",
              validate: async (value) => {
                let json;
                try {
                  json = await API.fetch(
                    `tracks/exists?title=${encodeURIComponent(value)}`
                  );
                } catch (e) {
                  setAlert({
                    message: "We're having some trouble connecting to Juke...",
                  });
                }
                return !json.exists || message;
              },
            })}
            autoComplete="off"
            type="text"
            errors={errors}
          />
          <Controller
            control={control}
            name="track.description"
            render={({ onChange, value, ref }) => (
              <TextArea
                value={value}
                onChange={onChange}
                inputRef={ref}
                label="Description"
                name="track.description"
                placeholder="what is this song about? how did you make it?"
              />
            )}
          />
          <div className="inline-flex flex-row items-center justify-start">
            <input
              ref={register}
              name="track.downloadable"
              type="checkbox"
              className="mx-2"
            />
            <label className="px-1" htmlFor="track.downloadable">
              Easy Download
            </label>
            <Info info={downloadInfo} />
          </div>
        </div>
      </div>
      <SubmitButton disabled={disabled} label="Submit" />
    </form>
  );
}
