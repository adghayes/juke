import AvatarEditor from "react-avatar-editor";
import React, { useState, useRef, useEffect } from "react";
import { Info } from "./FormHelpers";

const size = 192;
const defaultScale = 1;
const buttonClass =
  "relative text-xs my-1 py-0.5 px-1 bg-blue-400 overflow-hidden text-white font-light " +
  "hover:bg-blue-600 focus:bg-blue-600 mx-2";

function Thumbnailer({
  label,
  thumbnail,
  setThumbnail,
  editing,
  setEditing,
  oldThumbnail,
  placeholder,
  info,
}) {
  const [border, setBorder] = useState(1);
  const [scale, setScale] = useState(defaultScale);
  const fileInput = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    setBorder(0);
  }, []);

  useEffect(() => {
    fileInput.current.value = "";
    setScale(defaultScale);
  }, [oldThumbnail]);

  function reset(e) {
    fileInput.current.value = "";
    setScale(defaultScale);
    setThumbnail(undefined);
  }

  function cancel(e) {
    fileInput.current.value = "";
    setScale(defaultScale);
    setEditing(false);
  }

  function replace(e) {
    setThumbnail(undefined);
    setEditing(true);
  }

  function confirm() {
    const name = fileInput.current.files[0].name;
    editor.current.getImage().toBlob((blob) => {
      blob.name = name;
      setThumbnail(blob);
      setEditing(false);
    }, "image/jpeg");
  }

  function revert() {
    setThumbnail(null);
  }

  return (
    <div className="flex flex-col items-center">
      <span className="self-start font-medium inline-flex">
        <span>{label}</span>
        {info ? <Info info={info} /> : null}
      </span>
      <div className="flex flex-row">
        <div className="flex flex-col items-center">
          <div
            className={`relative w-min m-1 ${
              editing ? "" : "rounded-full overflow-hidden"
            }`}
          >
            <AvatarEditor
              ref={editor}
              image={
                editing || thumbnail
                  ? fileInput.current.files[0]
                  : typeof thumbnail === "undefined"
                  ? oldThumbnail
                  : placeholder
              }
              width={size}
              height={size}
              border={border}
              borderRadius={size / 2}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
            />
            <div
              className={`absolute inset-0 opacity-100 z-50 ${
                editing ? "hidden" : ""
              }`}
            ></div>
          </div>
          <div className="flex flex-row justify-center w-full">
            <button
              type="button"
              className={`${buttonClass} ${editing ? "hidden" : ""}`}
            >
              Replace
              <input
                type="file"
                ref={fileInput}
                accept="image/*"
                className={"absolute inset-0 z-50 opacity-0 text-xs"}
                onChange={replace}
              />
            </button>
            <button
              type="button"
              className={`${buttonClass} ${
                !editing && (thumbnail || thumbnail === null) ? "" : "hidden"
              }`}
              onClick={reset}
            >
              Reset
            </button>
            <button
              type="button"
              className={`${buttonClass} ${
                thumbnail && !editing ? "" : "hidden"
              }`}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className={`${buttonClass} ${editing ? "" : "hidden"}`}
              onClick={confirm}
            >
              Confirm
            </button>
            <button
              type="button"
              className={`${buttonClass} ${editing ? "" : "hidden"}`}
              onClick={cancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${buttonClass} ${
                !editing &&
                typeof thumbnail === "undefined" &&
                oldThumbnail !== placeholder
                  ? ""
                  : "hidden"
              }`}
              onClick={revert}
            >
              Revert To Default
            </button>
            <div
              className={`flex flex-col items-center ${
                editing ? "" : "hidden"
              }`}
            >
              <label htmlFor="imageScale" className="text-xs font-medium">
                Scale
              </label>
              <input
                id="imageScale"
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(e.target.valueAsNumber)}
                className="w-16 mx-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const editingThumbnailAlert = {
  message: (
    <>
      Keep or discard your changes to your avatar
      <span role="img" aria-label="ribbon">
        {" "}
        🎀
      </span>
    </>
  ),
};

export default Thumbnailer;
