import { useState, useEffect } from "react";

import Card from "../components/Card";
import Upload from "../components/Upload";
import SubmitTrack from "../components/SubmitTrack";
import Spinner from "../components/Spinner";
import Uploader from "../lib/uploader";
import { postTrack, patchTrack, getTrack } from "../lib/api-track";
import Link from "next/link";

import { redirectUnlessUser } from "../hooks/useRedirect";
import { mutate } from "swr";

export default function UploadPage(props) {
  const user = redirectUnlessUser();

  const [track, setTrack] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [visible, setVisible] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const transitionTo = (phaseIndex) => {
    setVisible(false);
    setTimeout(() => {
      setPhaseIndex(phaseIndex);
      setTimeout(() => {
        setVisible(true);
      }, 100);
    }, 500);
  };

  useEffect(() => {
    if (!!user) {
      setVisible(true);
    }
  }, [!!user]);

  useEffect(async () => {
    if (track) {
      if (track.processing === "started") {
        const pollId = setTimeout(async () => {
          setTrack(await getTrack(track.id));
        }, 5000);

        return () => clearTimeout(pollId);
      } else if (track.processing === "done" && user) {
        mutate(`users/${user.slug}/tracks`);
        mutate(`feed`);
      }
    }
  }, [track]);

  function onUploadProgress(e) {
    setUploadProgress(e.loaded / e.total);
  }

  async function onFileSelect(file) {
    transitionTo(1);

    const track = await postTrack({ submitted: false, uploaded: false });
    setTrack(track);

    const fileUpload = new Uploader(file, { onUploadProgress });
    const blobId = await fileUpload.start();
    setTrack(await patchTrack({ original: blobId, uploaded: true }, track.id));
  }

  function restart() {
    transitionTo(0);
    setTimeout(() => {
      setTrack(null);
      setUploadProgress(0);
    }, 500);
  }

  const phases = [
    <Upload onFileSelect={onFileSelect} />,
    <SubmitTrack
      uploadProgress={uploadProgress}
      track={track}
      callback={() => transitionTo(2)}
    />,
    <TrackStatus track={track} restart={() => restart()} />,
  ];

  return (
    <main className="flex items-center justify-center h-auto min-h-full min-w-full bg-gradient-to-tr from-blue-300 via-purple-300 to-red-300 box-border">
      <Card visible={visible}>{phases[phaseIndex]}</Card>
    </main>
  );
}

function TrackStatus({ track, restart }) {
  const status = track && track.processing;

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-xl p-4 sm:p-8 text-sm text-center sm:text-base">
      <h1 className="text-2xl lg:text-4xl font-bold pb-1">
        {statusHeader(status)}
      </h1>
      <p className="pb-4">{statusSubHeader(status)}</p>
      {statusIcon(status)}
      <div className="pt-4">{statusMessage(status, restart)}</div>
    </div>
  );
}

function statusHeader(status) {
  switch (status) {
    case "started":
      return "We've got your track";
    case "error":
      return "Something went wrong, oof";
    case "done":
      return "We are live!";
    default:
      return "Still uploading...";
  }
}

function statusSubHeader(status) {
  switch (status) {
    case "started":
      return "But we're still getting it ready";
    case "error":
      return "We weren't able to process your upload, sorry about that...";
    case "done":
      return "Your track is up and ready for listening!";
    default:
      return "Must be a big track!";
  }
}

function statusIcon(status) {
  switch (status) {
    case "error":
      return <ion-icon name="alert-circle" class="text-9xl text-red-600" />;
    case "done":
      return (
        <ion-icon name="checkmark-circle" class="text-9xl text-green-600" />
      );
    default:
      return <Spinner />;
  }
}

function statusMessage(status, restart) {
  switch (status) {
    case "done":
      return (
        <p>
          Check it out on{" "}
          <Link href="/stream">
            <a className="font-medium hover:underline">the stream</a>
          </Link>{" "}
          or in{" "}
          <Link href="/you">
            <a className="font-medium hover:underline">your library</a>
          </Link>
        </p>
      );
    case "error":
      return (
        <p>
          If you don't think anything was wrong with your file, try{" "}
          <a
            href="#"
            onClick={() => restart()}
            className="font-medium hover:underline"
          >
            uploading again
          </a>
        </p>
      );
    default:
      return (
        <p>
          It should appear in{" "}
          <Link href="/you">
            <a className="hover:underline font-medium">your library</a>
          </Link>{" "}
          later
        </p>
      );
  }
}
