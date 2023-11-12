import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const { id } = useParams();
  useEffect(() => {
    fetchListing();
  }, [id]);
  const fetchListing = async () => {
    const res = await fetch(`/api/listing/user-listing/${id}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.success === false) {
      setLoading(true);
      setError(true);
      return;
    }
    setListing(data);
    setLoading(false);
    setError(false);
  };
  const {
    name,
    description,
    regularPrice,
    discountPrice,
    address,
    bedrooms,
    bathrooms,
    furnished,
    petsAllowed,
    type,
    offer,
    parking,
    imageUrls,
  } = listing;

  const handleClickCopy = async () => {
    const url = location.href;
    await navigator.clipboard.writeText(url);
  };
  return (
    <main>
      {loading && (
        <p className='text-lg font-bold text-center my-7 '>Loading....</p>
      )}
      {error && (
        <p className='text-lg text-red-500 font-bold text-center my-7 '>
          Something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                //   className='h-auto'
                //   style={{
                //     backgroundImage: `url(${url}) no-repeat center`,
                //     backgroundSize: "cover",
                //   }}
                >
                  <img src={url} className='h-[484px] w-screen ' />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='flex flex-col gap-3 m-4'>
            <div className='flex flex-row justify-between '>
              <p className='font-bold'>
                {name} -$ {offer ? discountPrice : regularPrice}
                {type === "rent" && "/month"}
              </p>
              <button
                onClick={handleClickCopy}
                className='bg-green-700 text-white rounded-lg px-3 py-1'
              >
                Copy link
              </button>
            </div>
            <div className='flex flex-row gap-4 '>
              <p className='font-bold'>Adreess:</p>
              {address}
            </div>
            <div className='flex  flex-row gap-4 flex-wrap '>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {type === "rent" ? "For Rent" : "For Sale"}
              </p>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {" "}
                {bathrooms > 0 && <p>{bathrooms} Bathrooms</p>}
              </p>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {" "}
                {bedrooms > 0 && <p>{bedrooms} Bedrooms</p>}
              </p>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {" "}
                {furnished ? "Furnished" : "Not Funished"}
              </p>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {" "}
                {parking ? "Parking Allowed" : "No Parking"}
              </p>
              <p className='bg-slate-700 text-white rounded-lg px-3 py-1  '>
                {" "}
                {petsAllowed ? "Pets Allowed" : "Pats Not Allowed"}
              </p>
            </div>
            <div className='flex flex-row gap-2'>
              <p className='font-bold'>Description:</p>
              {description && description}
            </div>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
