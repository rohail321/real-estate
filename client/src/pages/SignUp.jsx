import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setError({
        [Object.keys(data)[1]]: data[Object.keys(data)[1]],
      });
      setLoading(false);
      retun;
    }
    setError({});
    setLoading(false);
    navigate("/sign-in");
  };
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form className='flex flex-col gap-4' onSubmit={submitHandle}>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Enter email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Enter Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opcacity-80 '
        >
          {loading ? "....Loading" : "Sign Up"}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have a account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700 cursor-pointer '>Sign In</span>
        </Link>
      </div>
      {Object.keys(error) &&
        Object.values(error).map((err) => (
          <div className='text-red-400'> {err}</div>
        ))}
    </div>
  );
}

export default SignUp;
