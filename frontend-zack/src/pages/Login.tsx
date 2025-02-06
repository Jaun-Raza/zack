import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("admin", response.data.admin);
        window.location.href = "/";
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
        <h1 className="font-bold">Log in</h1>
        <br />
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="form-control mt-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn !bg-primary mb-3">
            Sign In
          </button>
        </form>

        <div className="flex flex-column">
          <Link to="/forgot" className="text-white decoration-transparent">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-white decoration-transparent">
            Don't have an account?{" "}
            <span className="!text-primary">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
