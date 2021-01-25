import { SubmitButton, TextArea } from "./FormHelpers";
import Thumbnailer, { editingThumbnailAlert } from "./Thumbnailer";

import useUser from "../hooks/useUser";
import { useContext, useEffect, useReducer, useState } from "react";

import Uploader from "../lib/uploader";
import { patchUser } from "../lib/api-user";
import { defaultAvatar, getAvatar } from "../lib/thumbnails";
import { redirectUnlessUser } from "../hooks/useRedirect";
import Link from "next/link";
import { JukeContext } from "../pages/_app";

const thumbnailInfo =
  "Your thumbnail is what people see on your profile page, when you post " +
  "tracks without their own thumbnail, or when you comment on other artist's tracks";

function CompleteProfile({ callback }) {
  redirectUnlessUser();
  const { setAlert } = useContext(JukeContext);
  const { user, loading } = useUser();

  const [bio, setBio] = useState("");
  const [thumbnail, setThumbnail] = useState(undefined);
  const [editingThumbnail, setEditingThumbnail] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (user && user.bio) {
      setBio(user.bio);
    }
  }, [user]);

  if (loading)
    return <p className="font-bold text-2xl animate-pulse">loading...</p>;

  async function onSubmit(e) {
    e.preventDefault();
    if (editingThumbnail) {
      setAlert(editingThumbnailAlert);
      return;
    }

    if (!bio && !thumbnail) {
      return callback();
    }

    try {
      setDisabled(true);
      const payload = { bio };
      if (thumbnail) {
        const avatarUpload = new Uploader(thumbnail);
        payload.avatar = await avatarUpload.start();
      } else {
        payload.avatar = thumbnail;
      }
      await patchUser(user.id, payload);
      setThumbnail(undefined);
    } catch (e) {
      setAlert({
        message: "Oops, we had a problem updating your data. Try again?",
      });
    }
    setDisabled(false);
    if (callback) callback();
  }

  return (
    <form
      id="completeProfile"
      className="flex flex-col items-center px-8 py-4 bg-white rounded-xl"
      onSubmit={onSubmit}
    >
      <h1 className="text-3xl">Complete Profile</h1>
      <p className="text-xs mb-2">
        or{" "}
        <Link href="/stream">
          <a className="hover:underline font-medium">start listening...</a>
        </Link>
      </p>
      <div className="flex flex-col items-center space-between">
        <Thumbnailer
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          editing={editingThumbnail}
          setEditing={setEditingThumbnail}
          label="Avatar"
          oldThumbnail={getAvatar(user)}
          placeholder={defaultAvatar()}
          info={thumbnailInfo}
        />
        <TextArea
          label="Bio"
          name="bio"
          value={bio}
          placeholder="tell everyone a little about you or your music..."
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <SubmitButton disabled={disabled} label="Submit" />
    </form>
  );
}

export default CompleteProfile;
