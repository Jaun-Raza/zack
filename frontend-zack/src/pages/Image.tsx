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

export default function Image() {
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

  return (
    <div className="custom-height">
      <h1 className="mt-10">
        You&apos;ve uploaded{" "}
        <span className="gradient-bg text-transparent bg-clip-text font-bold">
          {namesParam?.split(",").length}
        </span>{" "}
        images!
      </h1>
      <p className="text-gray-500">
        Copy and share your links with friends, or post them on social media!
      </p>

      {exist && names && names.length > 1 && (
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full mx-auto max-w-[75vw]"
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
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute md:left-[32%] !rounded-xl top-1/2 !w-10 !h-10"
            variant="default"
          />
          <CarouselNext
            className="absolute md:right-[32%] !rounded-xl top-1/2 !w-10 !h-10"
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
        />
      )}
    </div>
  );
}

export function ImageItem({
  name,
  metadata,
  baseUrl,
  single,
  refetch,
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
    <div className="w-full pri image bg-black rounded-xl">
      <center>
        <img
          src={baseUrl + "/image/" + name}
          alt="."
          width={300}
          height={200}
          className="!w-[300px] !h-[200px] object-scale-down"
        />
      </center>
      <div className="infos">
        <div className="info">
          <p>Share</p>
          <div className="flex">
            <span>{baseUrl + "/share/" + name}</span>

            <button
              className="btn !bg-primary"
              onClick={() => handleCopy(baseUrl + "/share/" + name)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="info">
          <p>Direct</p>

          <div className="flex">
            <span>{baseUrl + "/image/" + name}</span>

            <button
              className="btn !bg-primary"
              onClick={() => handleCopy(baseUrl + "/image/" + name)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="info">
          <p>BBCode</p>

          <div className="flex">
            <span>[img]{baseUrl + "/image/" + name}[/img]</span>

            <button
              className="btn !bg-primary"
              onClick={() =>
                handleCopy("[img]" + baseUrl + "/image/" + name + "[/img]")
              }
            >
              Copy
            </button>
          </div>
        </div>

        <div className="info">
          <p>HTML</p>
          <div className="flex">
            <span>{'<img src="' + baseUrl + "/image/" + name + '" />'}</span>

            <button
              className="btn !bg-primary"
              onClick={() =>
                handleCopy('<img src="' + baseUrl + "/image/" + name + '" />')
              }
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      {single && metadata && (
        <>
          <div className="flex flex-row-reverse justify-between">
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
                  <Avatar className="comment-user-image mr-4">
                    <AvatarImage src={baseUrl + `/image/me?token=${token}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  <Input
                    className="form-control resize-none"
                    placeholder="Leave a comment..."
                    id={"comment-" + name}
                  />
                </form>
              )}

              {metadata &&
                metadata.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="comment relative w-full flex items-center gap-2"
                  >
                    <div className="flex items-center">
                      <Avatar className="comment-user-image mr-4">
                        <AvatarImage
                          src={baseUrl + "/image/" + comment.user.profileImage}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <strong className="mr-2">{comment.user.name}: </strong>{" "}
                      <span className="max-w-[500px] truncate">
                        {comment.comment}
                      </span>
                      <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {token && (
            <button
              className="btn !bg-primary !rounded-lg !w-full mt-4"
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
