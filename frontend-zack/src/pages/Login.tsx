import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthService } from "../services/apiService";
import { Input } from "@/components/ui/input";


const LoginContainer = styled.div`
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

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  span {
    color: #ff2092;
  }
`;

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
    <LoginContainer>
      <AuthForm>
        <FormTitle><i className="fa-solid fa-user"></i> Login</FormTitle>
        <br />
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Sign In</SubmitButton>
        </form>

        <FlexColumn>
          <StyledLink to="/forgot">Forgot Password? <span>Reset Now</span></StyledLink>
          <StyledLink to="/signup">
            Don't have an account? <span>Sign Up</span>
          </StyledLink>
        </FlexColumn>
      </AuthForm>
    </LoginContainer>
  );
}

export default Login;