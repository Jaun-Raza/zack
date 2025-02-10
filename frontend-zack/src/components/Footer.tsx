import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

const Footer = () => {
  const downloadLink = "https://mediafire.com/";

  return (
    <footer className="bg-black pt-4">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 col-12">
            <div className="text-start pb-3">
              <img src={Logo} className="logo" alt="Picto logo" />
              <p className="text-gray-300 w-1/2 text-justify">
                Picto is an image sharing website that offers the usual image
                uploading, with a unique effects feature which lets you upload
                circular, or animated images.
              </p>
              <DownloadButton href={downloadLink} target="_blank" rel="noreferrer">
                Download
              </DownloadButton>
            </div>
          </div>

          <div className="col-md-6 col-12">
            <div className="float-end flex">
              <div>
                <h2 style={{color: '#fff'}}>About</h2>
                <Link className="text-white text-decoration-none" to="/faq">
                  F.A.Q
                </Link>
              </div>
              <div>
                <h2 style={{color: '#fff'}}>Legal</h2>
                <Link className="text-white text-decoration-none" to="/terms">
                  Terms of Service
                </Link>
                <br />
                <Link className="text-white text-decoration-none" to="/privacy">
                  Privacy Policy
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const DownloadButton = styled.a`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s;
`;

export default Footer;
