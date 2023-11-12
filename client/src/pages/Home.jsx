import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";
function Home() {
  const [offerListing, setOfferListings] = useState([]);
  const [saleListing, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use(Navigation);
  useEffect(() => {
    fetchOfferListing().then((data) => {
      fetchRentLisitng().then(() => {
        fetchSaletLisitng();
      });
    });
  }, []);

  const fetchOfferListing = async () => {
    try {
      const res = await fetch("/api/listing/get?offer=true&limit=4");
      const data = await res.json();
      setOfferListings(data);
      return data;
    } catch (error) {}
  };
  const fetchRentLisitng = async () => {
    try {
      const res = await fetch("/api/listing/get?type=rent&limit=4");
      const data = await res.json();
      setRentListings(data);
      return data;
    } catch (error) {}
  };
  const fetchSaletLisitng = async () => {
    try {
      const res = await fetch("/api/listing/get?type=sell&limit=4");
      const data = await res.json();
      setSaleListings(data);
      return data;
    } catch (error) {}
  };

  return (
    <div>
      <div className='flex flex-col gap-6 py-28 px-3 mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Real Estate is the best place to find your next perfect place to live
          <br />
          we have wide range of properties to choose from
        </div>
        <Link
          to={"/search"}
          className='text-xs sm:text-sm font-bold text-blue-800 hover:unerline cursor-pointer '
        >
          <button>Let's start now</button>
        </Link>
      </div>
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div
                // style={{
                //   background: `url(${listing.imageUrls[0]}) center no-repeat `,
                //   backgroundSize: "cover",
                // }}
                className='h-[500px]'
                key={listing._id}
              >
                <img
                  src={listing.imageUrls[0]}
                  className='h-[484px] w-screen'
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Offer
              </h2>
              <Link className='text-sm text-blue-600' to={"/search?offer=true"}>
                Show more offer
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListing.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Properties to rent
              </h2>
              <Link className='text-sm text-blue-600' to={"/search?type=rent"}>
                Show more offer
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Offer
              </h2>
              <Link className='text-sm text-blue-600' to={"/search?type=sell"}>
                Show more offer
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListing.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
