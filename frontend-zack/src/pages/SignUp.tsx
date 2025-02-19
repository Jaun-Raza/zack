import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-bottom: 25rem;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;

  i {
    font-size: 1.5rem;
  }
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

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  span {
    color: #ff2092;
  }
`;

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
    <SignUpContainer>
      <AuthForm>
        <FormTitle><i className="fa fa-user-plus" aria-hidden="true"></i> 
        Register</FormTitle>
        <br />
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={24}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <br />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </form>
        <StyledLink to="/login">
          Already have an account? <span>Login</span>
        </StyledLink>
      </AuthForm>
    </SignUpContainer>
  );
}

export default SignUp;