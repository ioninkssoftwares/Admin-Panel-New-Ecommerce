import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the Cookies library
import "./loginadmin.css";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login`,
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        const { token } = response.data;
        const { _id } = response.data.user;
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("id", _id, { expires: 7 });
        navigate("/");
        window.location.reload();
        setLoading(false);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setError(""); // Clear error message on input change
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            {loading === false ? <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button> : <div className='flex items-center justify-center'><CircularProgress /></div>}
          </div>
          {/* <button className="btn" type="submit">
            Login
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
