import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Pages
import Layout from "./pages/Layout";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Image from "./pages/Image";
import Animation from "./pages/Animation";
import Public from "./pages/Public";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Faq from "./pages/Faq";
import List from "./pages/List";
import Admin from "./pages/Admin";

import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="reset/:code" element={<Reset />} />
          <Route path="share/:names" element={<Image />} />
          <Route path="list" element={<List />} />
          <Route path="admin" element={<Admin />} />
          <Route path="animation" element={<Animation />} />
          <Route path="public" element={<Public />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="faq" element={<Faq />} />
        </Route>
      </Routes>
        <Footer />
    </Router>
  );
}

export default App;
