import React, { useState } from "react";

import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.forgot(email);
      toast.success("Mail sent. Please, check your inbox.");
    } catch (e) {
      setError("Something went wrong. Please, try again.");
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center custom-height">
      <div className="auth-form">
        <h1 className="font-bold">Forgot Password</h1>
        <br />
        <form onSubmit={handleForgot}>
          <Input
            type="email"
            placeholder="Email"
            className="form-control mt-3"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn !bg-primary mb-3">
            Send Mail
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forgot;
