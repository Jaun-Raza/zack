import React, { useState } from "react";
import styled from "styled-components";
import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const ForgotContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AuthForm = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    input {
      color: #000;
      background-color: #fff;
    }
  }
`;
const FormTitle = styled.h1`
  font-weight: bold;
  color: white;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  text-align: center;
`;

const SubmitButton = styled.button`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: white;
  padding: 5px 1.3rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
`;

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
    <ForgotContainer>
      <AuthForm>
        <FormTitle>Forgot Password</FormTitle>
        <br />
        <form onSubmit={handleForgot}>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Send Mail</SubmitButton>
        </form>
      </AuthForm>
    </ForgotContainer>
  );
}

export default Forgot;