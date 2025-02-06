import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(username, email, password);
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("admin", response.data.admin);
        toast.success("Account created. Verify your email to start commenting");

        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        setError(response.data.error);
      }
    } catch (e) {
      setError("Something went wrong. Please, try again.");
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center custom-height">
      <div className="auth-form">
        <h1 className="font-bold">Register</h1>
        <br />
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Username"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={24}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            className="form-control mt-3"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="form-control mt-3"
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <br />
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn !bg-primary mb-3">
            Sign Up
          </button>
        </form>
        <Link to="/login" className="text-white decoration-transparent">
          Already have an account? <span className="!text-primary">Login</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
