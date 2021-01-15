import { useReducer, useState } from "react";
import {
  TextField,
  TextArea,
  SubmitButton,
  inputReducer,
  Info,
} from "./FormHelpers";
import Thumbnailer from "./Thumbnailer";
import Uploader from "../lib/uploader";
import { patchTrack } from "../lib/api-track";

const processingInfo =
  `We convert your music into formats suitable ` +
  `for streaming. If you enable downloads on your track, however, it is the ` +
  `original that will be downloaded.`;

const downloadInfo =
  `If you check this, other users will be able to download your ` +
  `track with a click!`;

export default function SubmitTrack({ uploadProgress, track, callback }) {
  const uploadComplete =
    track && ["done", "started", "error"].includes(track.processing);
  const [disabled, setDisabled] = useState(false);
  const [input, inputDispatch] = useReducer(inputReducer, {
    thumbnail: null,
    title: "",
    description: "",
    downloadable: false,
  });

  const [titleErrors, setTitleErrors] = useState([]);
  function syncTitleErrors(title) {
    setTitleErrors(title.length ? [] : ["Must have a title!"]);
  }

  async function onSubmit(e) {
    setDisabled(true);
    e.preventDefault();
    const payload = {
      submitted: true,
      description: input.description,
      title: input.title,
      downloadable: input.downloadable,
    };

    if (input.thumbnail) {
      const thumbnailUpload = new Uploader(input.thumbnail);
      payload.thumbnail = await thumbnailUpload.start();
    }
    const resBody = await patchTrack(payload, track.id);
    if (resBody.id) {
      if (callback) callback();
    } else {
      setTitleErrors(resBody.title);
      setDisabled(false);
    }
  }

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

  return (
    <form
      onSubmit={onSubmit}
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
          thumbnail={input.thumbnail}
          placeholder="/child-mike.jpg"
          inputDispatch={inputDispatch}
        />
        <div className="w-16 h-1"></div>
        <div className="flex flex-col">
          <TextField
            type="text"
            name="title"
            label="Title"
            value={input.title}
            inputDispatch={inputDispatch}
            errors={titleErrors}
            syncErrors={syncTitleErrors}
          />
          <TextArea
            label="Description"
            name="description"
            value={input.description}
            placeholder="what is this song about? how did you make it?"
            inputDispatch={inputDispatch}
          />
          <label className="inline-flex items-center justify-center pt-2">
            <input
              checked={input.downloadable}
              type="checkbox"
              className="mx-2"
              onChange={(e) =>
                inputDispatch({ downloadable: e.target.checked })
              }
            />
            <span className="font-medium">Easy Download</span>
            <Info info={downloadInfo} />
          </label>
        </div>
      </div>
      <SubmitButton disabled={!input.title || disabled} value="Submit" />
    </form>
  );
}
