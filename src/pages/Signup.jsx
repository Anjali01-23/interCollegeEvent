import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdPerson, MdEmail, MdSchool, MdLock } from "react-icons/md";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    role: "Student",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-50 to-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-4">Join CampusEventHub today</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* College */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">College/University</label>
            <div className="relative">
              <MdSchool className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Student">Student</option>
              <option value="College Admin">College Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
