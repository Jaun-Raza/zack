import React, { useState } from "react";

import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function Reset() {
  const { code } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const res = await AuthService.reset(password, code!);
      console.log(res);
      toast.success("Password changed! You can now login.");

      location.href = "/login";
    } catch (e) {
      setError("Something went wrong. Is the link still valid?");
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center custom-height">
      <div className="auth-form">
        <h1 className="font-bold">Reset Password</h1>
        <br />
        <form onSubmit={handleReset}>
          <Input
            type="password"
            placeholder="Password"
            className="form-control mt-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            className="form-control mt-3"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn !bg-primary mb-3">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reset;
