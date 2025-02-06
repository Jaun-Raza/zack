import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "../styles/ex.css";
import "../styles/image.css";

import { createPortal } from "react-dom";
import { BsExclamation } from "react-icons/bs";
import { ImageService } from "../services/apiService";

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
    <div className="flex flex-col justify-center items-center custom-height">
      <div className="grid md:grid-cols-4 gap-4 w-4/6 h-[75vh] mb-4 p-4">
        {images.slice((page - 1) * 12, page * 12).map((image) => (
          <div key={image.name} className="group relative">
            <button
              type="button"
              className="btn btn-danger !hidden group-hover:!block absolute right-0 top-0"
              onClick={() => {
                setDeleting(image.name);
              }}
            >
              x
            </button>

            <center>
              <p className="font-bold">
                Uploaded by{" "}
                <span className="gradient-bg text-transparent bg-clip-text">
                  {image.user?.name ?? "Anonymous"}
                </span>
              </p>
              <img
                src={baseUrl + "/image/" + image.name}
                alt="."
                width={300}
                height={150}
                className="w-[300px] h-[150px] object-scale-down"
              />
            </center>
            <div className="infos">
              <div className="info">
                <input
                  className="rounded-lg h-6 p-1 w-[200px] xl:w-[290px] text-black"
                  readOnly
                  value={baseUrl + "/share/" + image.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="rounded-lg rounded-r-none text-right px-3 !bg-[#2c992d] text-black font-bold h-6 flex gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
            }}
          >
            ←
          </button>
        </div>
        <div className="text-left px-3 !bg-primary text-black h-6">
          Page {page} of {Math.ceil(images.length / 12)}
        </div>
        <div className="rounded-lg rounded-l-none text-right px-3 !bg-[#2c992d] text-black font-bold h-6 flex gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.min(Math.ceil(images.length / 12), p + 1));
            }}
          >
            →
          </button>
        </div>
      </div>

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
                  className="btn btn-success !bg-primary text-black !rounded-full"
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
  );
}
