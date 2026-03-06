import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/auth/register", {
        name,
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;