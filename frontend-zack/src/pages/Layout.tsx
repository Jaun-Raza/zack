import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "../components/Navbar";

import { Particles } from "@/components/magicui/particles";
import styled from "styled-components";

const Layout = () => {
  return (
    <Wrapper>
      <div className="App">
        <Navbar />
        <Particles
          className="absolute inset-0 particles"
          quantity={10}
          ease={10}
          color={'#fff'}
          refresh
        />
        <Particles
          className="absolute inset-0 particles"
          quantity={5}
          ease={10}
          size={1}
          color={'#fff'}
          refresh 
        />
        <Outlet />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        limit={1}
        closeOnClick
        draggable={false}
        theme="dark"
        hideProgressBar
      />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .particles {
    width: 100%;
    height: 100vh;
    z-index: -1;

    canvas {
      width: 100% !important;
      height: 100% !important; 
    }
  }
`

export default Layout;
