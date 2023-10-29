import React, { useState, useEffect } from "react";
import Checkbox from "../components/Checkbox";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    petsAllowed: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const [apiLoading, setApiLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getUserListing(id);
  }, []);

  const getUserListing = async (id) => {
    const res = await fetch(`/api/listing/user-listing/${id}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.success === false) return;
    setFormData(data);
  };

  const handleImageClick = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Images should not exceed 2mb limit");
        });
    } else {
      setImageUploadError("6 images max");
      setUploading(false);
    }
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const handleDelete = (index) => {
    setFormData((perv) => ({
      ...perv,
      imageUrls: perv.imageUrls.filter((_, ind) => ind !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "petsAllowed"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setApiLoading(true);
      const res = await fetch(`/api/listing/upload/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setApiLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      setFormData(data);
      //   navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col sm:flex-row gap-4 '
      >
        <div className='flex flex-col gap-4 flex-1'>
          <input
            placeholder='Name'
            className='border p-3 rounded-lg '
            id='name'
            type='text'
            maxLength='62'
            minLength={"10"}
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg '
            id='description'
            type='text'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            placeholder='Address'
            className='border p-3 rounded-lg '
            id='address'
            type='text'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <Checkbox
              title='Sell'
              id='sell'
              handleChange={handleChange}
              type={formData.type}
            />
            <Checkbox
              title='Rent'
              id='rent'
              handleChange={handleChange}
              type={formData.type}
            />
            <Checkbox
              title='Parking spot'
              id='parking'
              handleChange={handleChange}
              type={formData.parking}
            />
            <Checkbox
              title='Furnished'
              id='furnished'
              handleChange={handleChange}
              type={formData.furnished}
            />
            <Checkbox
              title='Offer'
              id='offer'
              handleChange={handleChange}
              type={formData.offer}
            />
            <Checkbox
              title='Pets Allowed'
              id='petsAllowed'
              handleChange={handleChange}
              type={formData.petsAllowed}
            />

            {/* <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-5' />
        <span>Rent</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-5' />
        <span>Parking spot</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-5' />
        <span>Furnished</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-5' />
        <span>Offer</span>
      </div> */}
          </div>
          <div className=' flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className='flex items-center gap-2'>
              <input
                className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='regularPrice'
                min='50'
                max='100000'
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center '>
                <p>Regular price</p>
                <span className='text-xs'>($/ month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                className='p-3 border border-gray-300 rounded-lg'
                type='number'
                id='discountPrice'
                min='50'
                max='1000000'
                onChange={handleChange}
                value={formData.discountPrice}
                required
              />
              <div className='flex flex-col items-center '>
                <p>Discounted price</p>
                <span className='text-xs'>($/ month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:</p>
          <span className='font-normal text-gray-600 ml-2'>
            The first image will be the cover
          </span>
          <div className='flex gap-4 '>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-200 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              disabled={uploading}
              type='button'
              onClick={handleImageClick}
              className='bg-transparent border rounded hover:shadow-lg disabled:opacity-80 border-green-600 text-green-600 uppercase p-3'
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((img, index) => (
              <div
                className='flex justify-between items-center p-3'
                key={index}
              >
                <img src={img} className='w-40 h-40 object-cover rounded-lg' />
                <button
                  type='button'
                  onClick={() => handleDelete(index)}
                  className='p-3 text-red-700 rounded-lg uppercase'
                >
                  Delete
                </button>
              </div>
            ))}
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {apiLoading ? "Loading...." : "Update Listing"}
          </button>
          <p>{error && error}</p>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
