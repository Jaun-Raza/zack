import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <div className="App">
        <Navbar />
        <Outlet />
        <Footer />
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
    </>
  );
};

export default Layout;
