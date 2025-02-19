import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/ex.css";
import "../styles/image.css";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ImageService } from "../services/apiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styled from 'styled-components';

export default function Image() {
  const [count, setCount] = useState(0);
  const { names: namesParam } = useParams();
  const names = useMemo(() => {
    if (!namesParam) return [];

    const names = namesParam.split(",");
    if (names.length < 5 && names.length > 1) {
      const diff = 5 - names.length;
      for (let i = 0; i < diff; i++) {
        names.push(names[i]);
      }
    }

    return names;
  }, [namesParam]);
  const navigate = useNavigate();
  const baseUrl =
    import.meta.env.VITE_API_URL !== ""
      ? import.meta.env.VITE_API_URL
      : window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");

  const [api, setApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);
  const [exist, setExist] = useState(false);
  const [metadata, setMetadata] = useState<
    | {
      id: number;
      name: string;
      likes: {
        user: {
          id: string;
          name: string;
        };
        like: boolean;
      }[];
      comments: {
        id: number;
        comment: string;
        user: {
          id: number;
          name: string;
          profileImage: string;
        };
        date: string;
      }[];
      liked: boolean | null;
    }[]
    | null
  >(null);

  const fetchImage = useCallback(async () => {
    try {
      await ImageService.view(names[0]);
      setExist(true);

      const metadatas = [];

      for (const name of names)
        metadatas.push((await ImageService.metadata(name)).data);

      setMetadata(metadatas);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        toast.error("That image link does not exist, or was removed!");
        navigate("/");
        return;
      }

      toast.error("Something went wrong. Please, try again.");
      console.error(e);
    }
  }, [names, navigate]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage, names]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setSlide(api.selectedScrollSnap());
    });
  }, [api]);

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
    <div className="custom-height">
      <h1 className="mt-10 text-white">
        You&apos;ve uploaded{" "}
        <span className="!bg-primary text-transparent bg-clip-text font-bold">
          {namesParam?.split(",").length}
        </span>{" "}
        images!
      </h1>
      <p className="text-gray-500">
        Copy the links to share them!
      </p>

      {exist && names && names.length > 1 && (
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full mx-auto max-w-[95vw]"
          setApi={setApi}
        >
          <CarouselContent>
            {exist &&
              names.map((name, index) => (
                <CarouselItem
                  key={name + "-" + index}
                  className={cn(
                    "md:basis-1/2 lg:basis-1/3",
                    slide !== index ? "md:opacity-50 md:scale-90" : ""
                  )}
                >
                  <ImageItem
                    name={name}
                    metadata={metadata?.[index] ?? null}
                    baseUrl={baseUrl}
                    single={false}
                    refetch={fetchImage}
                    length={name.length}
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute md:left-[32%] top-1/2 !w-10 !h-10"
            variant="default"
          />
          <CarouselNext
            className="absolute md:right-[32%] top-1/2 !w-10 !h-10"
            variant="default"
          />
        </Carousel>
      )}
      {exist && names.length === 1 && (
        <ImageItem
          name={names[0]}
          metadata={metadata?.[0] ?? null}
          baseUrl={baseUrl}
          single
          refetch={fetchImage}
          length={names.length}
        />
      )}
      <Info>
        <p><span>{count}</span> Images Uploaded</p>
        <p><span>120</span> Screenshot Token</p>
      </Info>
    </div>
  );
}

export function ImageItem({
  name,
  metadata,
  baseUrl,
  single,
  refetch,
  length,
}: {
  name: string;
  metadata: {
    id: number;
    name: string;
    likes: {
      user: {
        id: string;
        name: string;
      };
      like: boolean;
    }[];
    comments: {
      id: number;
      comment: string;
      user: {
        id: number;
        name: string;
        profileImage: string;
      };
      date: string;
    }[];
    liked: boolean | null;
  } | null;
  baseUrl: string;
  single: boolean;
  length: number;
  refetch: () => void;
}) {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

  const handleCopy = (text: string) => {
    try {
      toast.success("Copied.", {
        autoClose: 1000,
      });
      navigator.clipboard.writeText(text);
    } catch (e) {
      toast.error("Couldn't copy.");
      console.error(e);
    }
  };

  return (
    <div className="w-full mb-10 image bg-black rounded-xl" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '5rem 0',
      marginBottom: '25rem'
    }}>
      <center>
        <img
          src={baseUrl + "/image/" + name}
          alt="."
          style={{
            maxWidth: length > 1 ? '400px' : '30%',
            maxHeight: length > 1 ? '300px' : '100%',
            backgroundColor: '#ffffff14'
          }}
        />
      </center>
      <div className="infos" style={{
        width: length > 1 ? '25rem' : '35rem',
        maxWidth: "90%"
      }}>
        <div className="info" style={{ marginBottom: '1rem' }}>
          <div className="flex items-center bg-black text-white px-3 py-1 rounded-fullflex items-center bg-black text-white px-3 py-1 rounded-full">
            <span style={{ borderTopLeftRadius: '5rem', borderEndStartRadius: '5rem', fontSize: '16px', height: '24px' }}>{baseUrl + "/share/" + name}</span>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-r-full flex items-center"
              onClick={() => handleCopy(baseUrl + "/share/" + name)}
            >
              <i className="fa fa-copy"></i>
            </button>
          </div>

        </div>

        <div className="info" style={{ marginBottom: '1rem' }}>

          <div className="flex items-center bg-black text-white px-3 py-1 rounded-full">
            <span style={{ borderTopLeftRadius: '5rem', borderEndStartRadius: '5rem', fontSize: '16px', height: '24px' }}>{baseUrl + "/image/" + name}</span>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-r-full flex items-center"
              onClick={() => handleCopy(baseUrl + "/image/" + name)}
            >
              <i className="fa fa-copy" style={{ color: '#fff' }}></i>
            </button>
          </div>
        </div>

        <div className="info" style={{ marginBottom: '1rem' }}>
          <div className="flex items-center bg-black text-white px-3 py-1 rounded-full">
            <span style={{ borderTopLeftRadius: '5rem', borderEndStartRadius: '5rem', fontSize: '16px', height: '24px' }}>[img]{baseUrl + "/image/" + name}[/img]</span>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-r-full flex items-center"

              onClick={() =>
                handleCopy("[img]" + baseUrl + "/image/" + name + "[/img]")
              }
            >
              <i className="fa fa-copy" style={{ color: '#fff' }}></i>
            </button>
          </div>
        </div>

        <div className="info" style={{ marginBottom: '1rem' }}>
          <div className="flex items-center bg-black text-white px-3 py-1 rounded-full">
            <span style={{ borderTopLeftRadius: '5rem', borderEndStartRadius: '5rem', fontSize: '16px', height: '24px' }}>{'<img src="' + baseUrl + "/image/" + name + '" />'}</span>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-r-full flex items-center"

              onClick={() =>
                handleCopy('<img src="' + baseUrl + "/image/" + name + '" />')
              }
            >
              <i className="fa fa-copy" style={{ color: '#fff' }}></i>
            </button>
          </div>
        </div>
      </div>

      {single && metadata && (
        <>
          <div className="flex flex-row-reverse justify-between text-white" style={{ maxWidth: "90%" }}>
            <div className="actions">
              <div className="relative group">
                <button
                  className="!rounded-lg btn !bg-primary"
                  onClick={async () => {
                    try {
                      if (metadata.liked === true) {
                        await ImageService.unlike(name);
                        toast.success("Undone.");
                      } else {
                        await ImageService.like(name);
                        toast.success("Liked.");
                      }

                      refetch();
                    } catch (e) {
                      toast.error(
                        "Something went wrong. Is your email verified?"
                      );
                      console.error(e);
                    }
                  }}
                  disabled={!token}
                >
                  <ThumbsUp />
                </button>
                <span className="ms-2">
                  {metadata.likes.filter((like) => like.like).length}
                </span>
                <div className="absolute hidden bg-black border-primary border rounded shadow-md p-2 w-48 z-10 group-hover:block">
                  <h4 className="font-bold">Liked by:</h4>
                  <ul className="list-disc list-inside">
                    {metadata.likes
                      .filter((like) => like.like)
                      .map((like) => (
                        <li key={like.user.id}>{like.user.name}</li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="relative group">
                <button
                  className="!rounded-lg btn !bg-primary"
                  onClick={async () => {
                    try {
                      if (metadata.liked === false) {
                        await ImageService.unlike(name);
                        toast.success("Undone.");
                      } else {
                        await ImageService.dislike(name);
                        toast.success("Disliked.");
                      }

                      refetch();
                    } catch (e) {
                      toast.error(
                        "Something went wrong. Is your email verified?"
                      );
                      console.error(e);
                    }
                  }}
                  disabled={!token}
                >
                  <ThumbsDown />
                </button>

                <span className="ms-2">
                  {metadata &&
                    metadata.likes.filter((like) => !like.like).length}
                </span>
                <div className="absolute hidden bg-black border-primary border rounded shadow-md p-2 w-48 z-10 group-hover:block">
                  <h4 className="font-bold">Disliked by:</h4>
                  <ul className="list-disc list-inside">
                    {metadata.likes
                      .filter((like) => !like.like)
                      .map((like) => (
                        <li key={like.user.id}>{like.user.name}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="comments">
              <h4>Comments</h4>
              {token && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const comment = (document.getElementById(
                      "comment-" + name
                    ) as HTMLTextAreaElement)!.value;
                    (
                      document.getElementById(
                        "comment-" + name
                      ) as HTMLTextAreaElement
                    ).value = "";

                    if (comment.trim() === "") {
                      toast.error("Comment can't be empty.");
                      return;
                    }

                    try {
                      await ImageService.comment(name, comment);
                      toast.success("Comment added.");

                      refetch();
                    } catch (e) {
                      toast.error(
                        "Something went wrong. Is your email verified?"
                      );
                      console.error(e);
                    }
                  }}
                  className="comment-form flex items-center"
                >
                  <Avatar className="comment-user-image mr-4 text-white">
                    <AvatarImage src={baseUrl + `/image/me?token=${token}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  <Input
                    className="form-control resize-none bg-white"
                    placeholder="Leave a comment..."
                    id={"comment-" + name}
                  />
                </form>
              )}

              {metadata &&
                metadata.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="comment relative w-full flex items-center gap-2 "
                  >
                    <CommentBox>
                      <Avatar className="comment-user-image mr-4">
                        <AvatarImage
                          src={baseUrl + "/image/" + comment.user.profileImage}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="info">
                        <strong>{comment.user.name}: </strong>{" "}
                        <p>
                          {comment.comment}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </CommentBox>
                  </div>
                ))}
            </div>
          </div>

          {token && (
            <button
              className="btn !bg-primary !rounded-lg mt-4 text-white"
              onClick={() => {
                ImageService.setProfileImage(name);
                toast.success("Profile image set.");
              }}
            >
              Set as profile image
            </button>
          )}

        </>
      )}
    </div>
  );
}

const CommentBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    p {
      background: #000;
      color: #fff;
      text-align: left;
      margin: 0;
      font-size: 1rem;
    }
  }
  
  @media(max-width: 768px) {
    flex-direction: column;  

    span {
      
    }
  }
`;

const Info = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;

  p {
    color: white; 

    span {
      color: #ea1ebd;
    }
  }
`;