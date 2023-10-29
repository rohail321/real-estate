import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOut,
} from "../redux/user/UserSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";

function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePec, SetFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(null);

  const [formData, setFormData] = useState({});
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        SetFilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const deleteHandle = async (e) => {
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(null));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleSignout = async (e) => {
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/auth/signout`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(signOut());
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleListing = async () => {
    try {
      setListingError(false);

      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setListing((perv) => perv.concat(data));
    } catch (error) {
      setListingError(true);
    }
  };
  const handeListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        return;
      }
      const newListing = listing.filter((listing) => listing._id !== listingId);
      setListing(newListing);
    } catch (error) {}
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='avatar'
          className='rounded-lg h-24 2-24 object-cover cursor-pointer self-center mt-2 '
        />
        <p className='text-sm text-center'>
          {fileUploadError ? (
            <span>Error uploading image</span>
          ) : filePec > 0 && filePec < 100 ? (
            <span> {`Uploading ${filePec}`}</span>
          ) : filePec === 100 ? (
            <span className='text-green-700'>{"Succesfully Uploaded"}</span>
          ) : (
            ""
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
        />
        <button className='p-3 mt-3 bg-slate-700 text-white rounded-lg uppercase hover:opcaity-95 disabled:opacity-80 '>
          Update
        </button>
        <Link
          className='bg-green-700  text-white p-3 mt-3 rounded-lg uppercase text-center hover:opacity-95'
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={deleteHandle}>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      <button onClick={handleListing} className='text-green-700 w-full'>
        Show Listing
      </button>
      {listing.length > 0
        ? listing.map((e, i) => (
            <div
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
              key={i}
            >
              <Link to={`/listing/${e._id}`}>
                <img
                  src={e.imageUrls[0]}
                  alt='listing'
                  className='h-16 w-16 object-contain rounded-lg '
                />
              </Link>
              <Link
                className='text-slate-700 semi-bold flex-1 truncate '
                to={`/listing/${e._id}`}
              >
                <p> {e.name} </p>
              </Link>
              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handeListingDelete(e._id)}
                  className='text-red-700 uppercase '
                >
                  Delete
                </button>
                <Link to={`/update-listing/${e._id}`}>
                  {" "}
                  <button className='text-green-700 uppercase '>Edit</button>
                </Link>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}

export default Profile;
