import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    furnished: false,
  });
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const navigate = useNavigate();
  console.log(sidebarData);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const typeUrl = urlParams.get("type");
    const parkingUrl = urlParams.get("parking");
    const furnishedUrl = urlParams.get("furnished");
    const offerUrl = urlParams.get("offer");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");
    if (
      searchTermUrl ||
      typeUrl ||
      parkingUrl ||
      furnishedUrl ||
      offerUrl ||
      sortUrl ||
      orderUrl
    ) {
      setSidebarData({
        searchTerm: searchTermUrl || "",
        type: typeUrl || "all",
        parking: parkingUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        offer: offerUrl === "true" ? true : false,
        sort: sortUrl || "created_at",
        order: orderUrl || "desc",
      });
      const fetchListing = async () => {
        setLoading(true);

        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
          setShowMoreBtn(true);
        }

        setListing(data);
        setLoading(false);
      };
      fetchListing();
    }
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSidebarData((perv) => ({ ...perv, type: e.target.id }));
    }
    if (e.target.id === "searchTerm") {
      setSidebarData((perv) => ({ ...perv, searchTerm: e.target.value }));
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData((perv) => ({
        ...perv,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      }));
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      console.log(e.target.value.split("_"));
      setSidebarData((perv) => ({ ...perv, sort, order }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    console.log(window);
    console.log(window.location);
    console.log(window.location.search);
    navigate(`/search?${searchQuery}`);
  };
  const onShowMore = async () => {
    const numberOfListing = listing.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 8) {
      setShowMoreBtn(false);
    }
    setListing((perv) => [...perv, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap'>Search Term:</label>
            <input
              type='text'
              placeholder='Search...'
              id='searchTerm'
              className='border rounded-lg p-3 w-full'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center '>
            <label>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent&Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
                type='checkbox'
                id='rent'
                className='w-5'
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={sidebarData.type === "sell"}
                type='checkbox'
                id='sell'
                className='w-5'
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={sidebarData.offer}
                type='checkbox'
                id='offer'
                className='w-5'
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center '>
            <label>Amenities:</label>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={sidebarData.parking}
                type='checkbox'
                id='parking'
                className='w-5'
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={sidebarData.furnished}
                type='checkbox'
                id='furnished'
                className='w-5'
              />
              <span>Furnished</span>
            </div>
          </div>
          <div>
            <label className='flex items-center gap-2'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value={"regularPrice_desc"}>Price high to low </option>
              <option value={"regularPrice_asc"}>Price low to high </option>
              <option value={"createdAt_desc"}>Latest </option>
              <option value={"createdAt_asc"}>Oldest </option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 mt-5 text-slate-700'>
          Listing Result
        </h1>
        <div className='flex gap-4 flex-wrap p-7 '>
          {!loading && listing.length === 0 && (
            <p className='text-xl text-slate-700 '>No Listing found</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700  textcenter w-full '>
              Loading...
            </p>
          )}
          {!loading &&
            listing.length > 0 &&
            listing.map((item) => (
              <ListingItem key={item._id} listing={item} />
            ))}
          {showMoreBtn && (
            <button
              className='text-green-700 text-center w-full '
              onClick={onShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
