import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "../styles/ex.css";
import "../styles/image.css";

import { createPortal } from "react-dom";
import { BsExclamation } from "react-icons/bs";
import { ImageService } from "../services/apiService";

import styled from "styled-components";

export default function List() {
  const baseUrl =
    import.meta.env.VITE_API_URL !== ""
      ? import.meta.env.VITE_API_URL
      : window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");

  const [images, setImages] = useState<
    {
      name: string;
      user: {
        name: string;
      };
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [scale, setScale] = useState(13);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setImages(await ImageService.list());
      } catch (e) {
        toast.error("Something went wrong. Please, try again.");
        console.error(e);
      }
    };

    fetchImage();
  }, []);

  return (
    <Wrapper>
      <Head>
        <h1>Your Photos</h1>
        <p>Your photos are memories for a lifetime. Save them here.</p>
      </Head>
      <div className="scale">
        <div className="scaling-block">
        <span>Image Scale</span>
        <RangeInput
          type="range"
          min="13"
          max="100"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        </div>
      </div>

      <Images>
        {images.slice((page - 1) * 12, page * 12).map((image) => (
          // @ts-ignore
          <Image key={image.name} scale={scale} >
            <img src={baseUrl + "/image/" + image.name} alt="." />

            <div className="actions">

              <button
                className="btn"
                style={{
                  backgroundColor: '#CF5BEC',
                  width: '1rem',
                  height: '2.4rem',
                  padding: '0 1.3rem',
                  borderRadius: '1rem',
                  fontSize: '1.1rem'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/share/" + image.name);
                  toast.success("Copied to clipboard!");
                }}
              >
                <i className="fa fa-copy"></i>
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: '#EC6060',
                  width: '1rem',
                  height: '2.4rem',
                  padding: '0 1.3rem',
                  borderRadius: '1rem',
                  fontSize: '1.3rem'
                }}
                onClick={() => setDeleting(image.name)}
              >
                X
              </button>
            </div>

            {/* <div className="info">
              <input readOnly value={window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/share/" + image.name} />
            </div> */}
          </Image>
        ))}
        <div className="image-skeleton">
          {!images.length && Array.from({ length: 20 }).map((_, i) => <FakeImage key={i} />)}
        </div>
      </Images>

      <div className="flex">
      <Pagination>
          <p><span>{images.length}</span> Images</p>
          <div className="pages">
            <button
              className="rounded-lg !bg-primary text-white font-bold items-center"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ←
            </button>

            {Array.from({ length: Math.ceil(images.length / 12) < 5 ? Math.ceil(images.length / 12) : 5 }).map((_, i) => {
              const totalPages = Math.ceil(images.length / 12);
              let startPage = Math.max(1, page - 2); 

              if (startPage + 4 > totalPages) {
                startPage = Math.max(1, totalPages - 4);
              }

              const pageNum = startPage + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="page"
                  style={{
                    background:  pageNum === page ? 'rgb(214, 30, 238)' : 'linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092)'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="rounded-lg !bg-primary text-white font-bold items-center"
              onClick={() => setPage((p) => Math.min(Math.ceil(images.length / 12), p + 1))}
              disabled={page === Math.ceil(images.length / 12)}
            >
              →
            </button>
          </div>
        </Pagination>


        {createPortal(
          deleting ? (
            <div
              className="delete-modal-container"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setDeleting(null);
                }
              }}
            >
              <div className="pri image bg-black/75 flex flex-col justify-center items-center text-center">
                <BsExclamation className="text-9xl text-red-500" />

                <p className="text-lg text-white">
                  You must confirm that you want to delete this photo.
                  <br />
                  Note: This action is un-doable.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn !bg-primary !rounded-full text-white"
                    onClick={async () => {
                      try {
                        await ImageService.delete(deleting);
                        setImages(images.filter((i) => i.name !== deleting));
                        setDeleting(null);
                      } catch (e) {
                        toast.error("Something went wrong. Please, try again.");
                        console.error(e);
                      }
                    }}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger !rounded-full"
                    onClick={() => {
                      setDeleting(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null,
          document.getElementById("root")!
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgb(0, 0, 0);
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: white;
  padding: 0 1rem;
  margin: 3rem 0;
  margin-bottom: 25rem;

  .scale {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: -4rem;
    
    .scaling-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  @media(max-width: 768px) {
    
    .scale {
      margin: 0;
      display: none;
    }
  }
`

const Head = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: space-around;

  p {
    color:rgba(255, 255, 255, 0.8);
  }
    
`;

const RangeInput = styled.input`
  -webkit-appearance: none;
  width: 150px;
  height: 4px;
  background:rgb(255, 255, 255);
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    background: #ff2092;
    border: 2px solid #ff2092;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: white;
    border: 2px solid #ff2092;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const Images = styled.section`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 5rem;
  backdrop-filter: blur(10px);
  
  .image-skeleton {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    margin: auto;
  }

  @media(max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    
    .image-skeleton {
      justify-content: center;
    }
  }
`
const Image = styled.div<{ scale: number }>`
  width: ${({ scale }) => scale}%;
  height: ${({ scale }) => scale * 10}px;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  position: relative;
  overflow: hidden; 
  transition: all 0.3s ease-in-out;

  @media(max-width: 768px) {
    width: 100%;
    height: fit-content;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center; 
    border-radius: 1rem;
  }

  .info {
    width: 100%;

    input {
      background-color: rgba(255, 255, 255, 0.65);
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      width: 100%;
      color: rgb(43, 41, 41);
    }
  }

  &:hover .actions {
    opacity: 1;
  }

  .actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .btn {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const Pagination = styled.div`
  display: flex;
  flex-direction: column;

  p {
    span {
      color: #ff2092;
      text-shadow: 1px 1px 3px #ff2092;
    }
  }

  .pages {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;

    .page {
      margin: 0;
      padding: 2px 10px;
      border-radius: 0.5rem;
      box-shadow: 0px 0px 2px 5px rgba(100, 13, 88, 0.77);
    }

    button {
      box-shadow: 0px 0px 2px 5px rgba(100, 13, 88, 0.77);
      margin: 0 5px;
      padding: 3px 10px;
      text-align: center;
    }
  }
`;

const FakeImage = styled.section`
  background-color:rgba(48, 47, 47, 0.34);
  width: 13rem;
  height: 8rem;
  border-radius: 1rem;
`;