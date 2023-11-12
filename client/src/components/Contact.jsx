import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, serLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        serLandlord(data);
      } catch (error) {}
    };
    fetchLandlord();
  }, [listing.userRef]);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact<span className='font-semibold'>{landlord.username}</span>{" "}
            for{" "}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            placeholder='Enter your message'
            className='w-full border p-3 rounded-lg '
            onChange={handleChange}
            name='message'
            id='message'
            value={message}
            rows='2'
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
            className='bg-slate-700 text-center p-3 uppercasse3 rounded-lg '
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
