import { useContext, useState } from "react";
import Dropzone from "react-dropzone";
import { JukeContext } from "../pages/_app";
import { SubmitButton } from "./FormHelpers";

const accept = [
  ".wav",
  ".flac",
  ".aiff",
  ".aif",
  ".alac",
  ".mp3",
  ".aac",
  ".ogg",
  ".vorbis",
  ".mp4",
  ".mp2",
  ".m4a",
  ".3gp",
  ".3g2",
  ".mj2",
  ".amr",
  ".wma",
];

function Upload({ onFileSelect }) {
  const { setAlert } = useContext(JukeContext);
  const [disabled, setDisabled] = useState(false);

  function onDropAccepted(acceptedFiles) {
    setDisabled(true);
    onFileSelect(acceptedFiles[0]);
    setDisabled(false);
  }

  function onDropRejected() {
    setAlert({ message: "Sorry, we can't accept that file..." });
  }

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-xl mx-16 sm:mx-24">
      <h1 className="text-xl md:text-3xl lg:text-5xl text-bold font-bold py-2 lg:py-4">
        Upload Your Music
      </h1>
      <Dropzone
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        accept={accept}
        maxFiles={1}
        maxSize={50000000}
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <section
            {...getRootProps()}
            className={`self-stretch flex flex-col items-center justify-center focus:outline-none`}
          >
            <input {...getInputProps()} />
            <div
              className={
                `self-stretch flex flex-col items-center justify-center px-20 py-12 md:px-36 md:py-28 lg:px-56 lg:py-44 ` +
                `m-1.5 border-black border-dashed border-2 rounded-xl md:text-lg lg:text-xl`
              }
            >
              <p className="whitespace-nowrap">Drag and Drop or</p>
              <SubmitButton disabled={disabled} label="Click" type="button" />
              <p className="whitespace-nowrap">to select a file</p>
            </div>
          </section>
        )}
      </Dropzone>
      <p className="text-xs px-6 pb-1 italic text-center">
        We accept most types of audio files, although we recommend you upload in
        a lossless format like FLAC or ALAC. Maximum file size: 50MB
      </p>
    </div>
  );
}

export default Upload;
