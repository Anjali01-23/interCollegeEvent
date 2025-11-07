import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdPerson, MdEmail, MdSchool, MdLock } from "react-icons/md";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    role: "Student", // UI selection only
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New handleSubmit: always create user as 'student', then optionally create admin-request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Prevent users from requesting superadmin via UI.
    if (formData.role === "Super Admin") {
      setError(
        "Super Admin accounts are created manually. Please contact the system administrator."
      );
      return;
    }

    setLoading(true);
    try {
      // 1) Create user account — always role: student
      const payload = {
        fullName: formData.fullName, 
        email: formData.email, 
        college: formData.college,
        password: formData.password,
        role: "Student", // IMPORTANT: Force 'student' on creation
      };

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("signup response", res.status, data);

      if (!res.ok) {
        // server-side validation error
        setError(data.message || "Signup failed. Try again.");
        setLoading(false);
        return;
      }

      // At this point the account was created as student.
      // Try to determine the created user's id from response so we can create an admin request.
      // Backend should ideally return the created user object; handle common shapes.
      const createdUserId = data.id ?? data.insertId ?? data.user?.id ?? null;
console.log("createdUserId:", createdUserId);

      // 2) If the user wanted College Admin, create an admin request for superadmin approval
      if (formData.role === "College Admin") {
        if (!createdUserId) {
          // If backend didn't return id, try to send admin-request using email instead (fallback)
          // Backend should handle either user_id or email, choose what's implemented on server.
          try {
            const reqBody = {
              // send both so server can match
              user_id: null,
              email: formData.email,
              college: formData.college,
              requested_role: "College Admin",
              message: "Request to be approved as College Admin",
            };

            const r = await fetch("http://localhost:5000/api/admin-requests", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reqBody),
            });
console.log("admin-requests response status:", r.status, "ok:", r.ok,r,reqBody);

  // read body safely: try json, fallback to text
  let body;
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    body = await r.json().catch(() => null);
  } else {
    body = await r.text().catch(() => null);
  }
  console.log("admin-requests response body:", body);
            if (!r.ok) {
              const errData = await r.json().catch(() => ({}));
              console.warn("Admin request fallback failed:", errData);
              alert(
                "Account created as Student. We couldn't auto-create the admin request — please contact the superadmin with your email to request admin access."
              );
            } else {
              alert(
                "Account created as Student. Admin request submitted — superadmin will review your request."
              );
            }
          } catch (err) {
            console.error("Admin request fallback error", err);
            alert(
              "Account created but admin request couldn't be sent. Contact the superadmin."
            );
          }
        } else {
          // we have user id — send clean admin request
          try {
            const reqBody = {
              user_id: createdUserId,
              email: formData.email,
              college: formData.college,
              requested_role: "College Admin",
              message: "Request to be approved as College Admin",
            };

            const r = await fetch("http://localhost:5000/api/admin-requests", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reqBody),
            });

            if (!r.ok) {
              const errData = await r.json().catch(() => ({}));
              console.warn("Admin request failed:", errData);
              alert(
                "Account created as Student. Failed to create admin request automatically — contact the superadmin."
              );
            } else {
              alert(
                "Account created as Student. Admin request submitted — superadmin will review your request."
              );
            }
          } catch (err) {
            console.error("Admin request error", err);
            alert(
              "Account created but admin request couldn't be sent. Contact the superadmin."
            );
          }
        }
      } else {
        // Normal student signup
        alert("Account created successfully!");
      }

      // Done
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Network error or server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
      <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2">Create Account</h2>
        <p className="text-gray-300 text-center mb-4">Join CampusEventHub today</p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                           bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                           bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                required
              />
            </div>
          </div>

          {/* College */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">College/University</label>
            <div className="relative">
              <MdSchool className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                           bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                         bg-gray-700 text-gray-100 border-gray-600"
            >
              <option value="Student">Student</option>
              <option value="College Admin">College Admin</option>
              {/* Super Admin option disabled to prevent requests via UI */}
              <option value="Super Admin" disabled>
                Super Admin (not available via signup)
              </option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              If you choose <strong>College Admin</strong>, a request will be sent to the superadmin for approval.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                           bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                           bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
