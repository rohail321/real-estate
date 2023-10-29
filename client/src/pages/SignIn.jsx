import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/UserSlice";
import OAuth from "../components/OAuth";
function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      delete data.success;
      delete data.statusCode;
      dispatch(signInFailure(Object.entries(data)));
      // setError(Object.entries(data));
      // setLoading(false);
      return;
    }
    dispatch(signInSuccess(data));
    navigate("/profile");
  };
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={submitHandle}>
        <input
          type='email'
          placeholder='Enter email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Enter Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opcacity-80 '
        >
          {loading ? "....Loading" : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have a account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 cursor-pointer '>Sign Up</span>
        </Link>
      </div>
      {error.length > 0 &&
        error.map((err, ind) => (
          <div key={ind} className='text-red-400'>
            {" "}
            {err[1]}
          </div>
        ))}
    </div>
  );
}

export default SignIn;
