import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be in the format: +1234567890";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ general: data.message });
        toast.error("Error", {
          description: data.message,
        });
      } else {
        setErrors({});
        navigate("/sign-in");
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            className={`border p-3 rounded-lg w-full ${errors.username ? 'border-red-500' : ''}`}
            placeholder="Username"
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 mt-1">{errors.username}</p>}
        </div>
        <div>
          <input
            className={`border p-3 rounded-lg w-full ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            className={`border p-3 rounded-lg w-full ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="Phone (+92123456789)"
            id="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <input
            className={`border p-3 rounded-lg w-full ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
