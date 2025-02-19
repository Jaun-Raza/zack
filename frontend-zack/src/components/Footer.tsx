import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

const Footer = () => {
  const downloadLink = "https://mediafire.com/";

  return (
    <FooterContainer>
      <FooterContent>
        <LeftSection>
          <LogoImg src={Logo} alt="Picto logo" />
          <Description>
            Picto is an image sharing website that offers the usual image
            uploading, with a unique effects feature which lets you upload
            circular, or animated images.
          </Description>
          <DownloadButton href={downloadLink} target="_blank" rel="noreferrer">
            Download
          </DownloadButton>
        </LeftSection>
        <RightSection>
          <Column>
            <ColumnTitle>About</ColumnTitle>
            <StyledLink to="/faq">F.A.Q</StyledLink>
          </Column>
          <Column>
            <ColumnTitle>Legal</ColumnTitle>
            <StyledLink to="/terms">Terms of Service</StyledLink>
            <StyledLink to="/privacy">Privacy Policy</StyledLink>
          </Column>
        </RightSection>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: black;
  padding: 1rem 0;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const FooterContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  margin: 0 auto;
  padding: 0 2rem;
  flex-wrap: wrap;

  @media(max-width: 768px) {
    justify-content: center;
  }
`;

const LeftSection = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media(max-width: 768px) {
    width: 100%;
  }
`;

const LogoImg = styled.img`
  width: 150px;
`;

const Description = styled.p`
  color: #d1d5db;
  text-align: justify;
`;

const DownloadButton = styled.a`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(to bottom right, #ff2092, rgb(214, 30, 238));
  }
`;

const RightSection = styled.div`
  display: flex;
  gap: 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h2`
  color: #fff;
  margin-bottom: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-bottom: 0.3rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;
