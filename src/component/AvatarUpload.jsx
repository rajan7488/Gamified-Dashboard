// components/AvatarUpload.jsx
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { toast } from 'react-toastify';

const AvatarUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first");
    const user = auth.currentUser;
    if (!user) return toast.error("Please login");

    const avatarRef = ref(storage, `avatars/${user.uid}`);
    setUploading(true);

    try {
      await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(avatarRef);

      await updateDoc(doc(db, "users", user.uid), {
        avatarURL: downloadURL
      });

      toast.success("Avatar updated!");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
};

export default AvatarUpload;
