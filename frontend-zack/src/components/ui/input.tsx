import * as React from "react";
import styled from "styled-components";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 0.5rem;
  padding-left: -5px;
  font-size: 0.875rem; 
  line-height: 1.25rem;
  border-radius: 1rem;
  background-color: black; 
  border: none;
  outline: none;
  
 
  &[type="file"] {
    border: 0;
    background-color: transparent;
    font-size: 0.875rem; 
    font-weight: 500;
    color: #0a0a0a; 
    }
    
    
    &::placeholder {
      color: #737373;
  }

  
  &:disabled {
    cursor: not-allowed; 
    opacity: 0.5; 
    }
    
    
  @media (prefers-color-scheme: dark) {
    border-color: #262626; 
    background-color: #0a0a0a;
    color: #f5f5f5; 
    &::placeholder {
      color: #a3a3a3;
    }

    &:focus-visible {
      outline-color: #d4d4d4; 
    }
  }
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => {
    return <StyledInput type={type} ref={ref} {...props} />;
  }
);

Input.displayName = "Input";

export { Input };