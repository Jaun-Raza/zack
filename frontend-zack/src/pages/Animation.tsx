import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImageService } from "../services/apiService";
import styled from "styled-components";
import { createCircularImage, createHexagonImage } from "../utils/imageUtils";
import Circle from '../assets/images/circle.png'
import Hexagon from '../assets/images/Hexagon.png'
import RoundedSquare from '../assets/images/rounded_square.png'
import Upload from "../assets/images/upload.png"

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15rem;
  height: 100vh;

  
`;

const Homer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 2.5rem;

  @media(max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Badge = styled.span`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: black;
  font-size: 15px;
  padding: 0 2px;
  display: inline-block;
  margin-left: 8px;
`;

const Description = styled.p`
  font-family: "YuGothic", sans-serif;
  font-weight: 300;
  font-size: 18px;
  color: #fff;
  margin-top: -8px;

  @media(max-width: 768px) {
    font-size: 13px;
    margin-top: -5px;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
  margin-top: 16px;
  cursor: pointer;
`;

const ColorInput = styled.input`
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 4px;
  margin: 0 8px;
`;

const Info = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;

  p {
    color: #fff;

    span {
      color: #ea1ebd;
    }
  }
`;

export default function Animation() {
  const navigate = useNavigate();

  const [action, setAction] = useState(0);
  const [color1, setColor1] = useState("#FF0000");
  const [color2, setColor2] = useState("#0000FF");
  const [uploading, setUploading] = useState(0);
  const [count, setCount] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleColorChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor1(e.target.value);
  };

  const handleColorChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor2(e.target.value);
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: number
  ) => {
    if (uploading !== 0) return;
    setUploading(type);

    const uploadedFile = e.target.files![0];
    if (!uploadedFile) return;

    try {
      let finalFile = uploadedFile;

      if (type === 1) {
        const response = await ImageService.animate(
          uploadedFile,
          color1,
          color2
        );
        if (response.error) {
          throw new Error(response.error);
        } else {
          const blob = new Blob([response.data], { type: "image/gif" });
          finalFile = new File([blob], "animated.gif", { type: "image/gif" });
        }
      } else if (type === 2) {
        finalFile = await new Promise((resolve) => {
          createCircularImage(uploadedFile, function (circularFile) {
            resolve(circularFile);
          });
        });
      } else if (type === 3) {
        finalFile = await new Promise((resolve) => {
          createHexagonImage(uploadedFile, function (hexagonFile) {
            resolve(hexagonFile);
          });
        });
      }

      const response = await ImageService.upload([finalFile]);
      const name = response.data.files.join(",");
      if (name) {
        navigate(`/share/${name}`);
        toast.success("Your image has been uploaded successfully!", {
          autoClose: 5000,
        });
      } else {
        throw new Error(response.data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const errorMessage =
        e.message || "Something went wrong. Please, try again.";
      toast.error(errorMessage);
      console.error(e);
    } finally {
      setUploading(0);
    }
  };

  useEffect(() => {
      ImageService.count()
        .then((count) => {
          setCount(count);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  return (
    <Container>
      <Homer>
        <Title>
          Try out our profile <GradientText>effects</GradientText>!{" "}
          <Badge>BETA</Badge>
        </Title>

        <Description>
          Spice up your pictures with profile effects!
        </Description>
        <br />
        <div style={{ borderRadius: '0.25rem' }}>
          <Select
            disabled={uploading !== 0}
            onValueChange={(value) => setAction(parseInt(value))}
          >
            <SelectTrigger className="upload-main !mt-0">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="upload-main !h-full">
          
              <SelectItem value="1"><div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingLeft: '1rem'}}>
              <img style={{width: '25px'}} src={RoundedSquare} alt="rounded" /> <span >Border</span></div> <div style={{backgroundColor: '#0d0d0d45', padding: '5px 6px'}}><img src={Upload} alt="" style={{width: '35px',
        height: '100%'}} /></div></div></SelectItem>

            <SelectItem value="2" style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}><div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingLeft: '1rem'}}>
              <img style={{width: '25px'}} src={Circle} alt="rounded" /> <span >Circular</span></div> <div style={{backgroundColor: '#0d0d0d45', padding: '5px 6px'}}><img src={Upload} alt="" style={{width: '35px',
        height: '100%'}} /></div></div></SelectItem>
             
             <SelectItem value="3"><div  style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingLeft: '1rem'}}>
              <img style={{width: '25px'}} src={Hexagon} alt="rounded" /> <span >Hexagon</span></div> <div style={{backgroundColor: '#0d0d0d45', padding: '5px 6px'}}><img src={Upload} alt="" style={{width: '35px',
        height: '100%'}} /></div></div></SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, action)}
            className="hidden"
            id="file"
            ref={fileRef}
          />

          {action == 1 && uploading == 0 && (
            <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: 'center' }}>
              <ColorInput
                type="color"
                value={color1}
                onChange={handleColorChange1}
              />
              <ColorInput
                type="color"
                value={color2}
                onChange={handleColorChange2}
              />
            </div>
          )}

          {action > 0 && uploading == 0 && (
            <UploadButton
              onClick={() => {
                fileRef.current?.click();
              }}
            >
              Upload Image
            </UploadButton>
          )}
        </div>
        <Info>
          <p><span>{count}</span> Images Uploaded</p>
          <p><span>120</span> Screenshot Token</p>
        </Info>
      </Homer>
    </Container>
  );
}