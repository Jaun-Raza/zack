import { useState } from "react";
import styled from "styled-components";
import { AuthService } from "../services/apiService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 15rem;

   @media(max-width: 1500px) {
    height: 100vh;
    margin-bottom: 25rem;
  }
`;

const FormWrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    input {
      color: #000;
      background-color: #fff;
    }
  }
`;

const Title = styled.h1`
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: white;
  padding: 5px 1.3rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

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
    <Container>
      <FormWrapper>
        <Title>Reset Password</Title>
        <form onSubmit={handleReset}>
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Change Password</Button>
        </form>
      </FormWrapper>
    </Container>
  );
}

export default Reset;
