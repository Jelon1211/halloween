"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IImage {
  url: string;
  filename: string;
}

const Images = () => {
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState([]);
  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);
  const [isPhotoSending, setIsPhotoSending] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      const getUser = async () => {
        const responseUser = await axios.get(
          `http://localhost:8000/player?name=${name}`
        );
        setUser(responseUser.data.results[0][0]);
      };

      const getPhotos = async () => {
        const responsePhotos = await axios.get("http://localhost:8000/upload");
        setPhotos(responsePhotos.data.files);
      };

      Promise.all([getUser(), getPhotos()])
        .then(() => console.log("git"))
        .catch((e) => console.log("error -> ", e));
    } else {
      router.push("/");
    }
  }, [isPhotoSending, router, setUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file);
      const photoURL = URL.createObjectURL(file);
      setPhoto(photoURL);
    }
  };

  const compressImage = async (image: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(image, options);
      setCompressedFile(compressed as File);
    } catch (error) {
      console.error("Błąd podczas kompresji obrazu:", error);
    }
  };

  const handleUpload = async () => {
    if (!compressedFile) {
      alert("Proszę najpierw wybrać zdjęcie!");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("photo", compressedFile);

    try {
      setIsPhotoSending(true);
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Obraz wysłany:", response.data);
    } catch (error) {
      console.error("Błąd podczas wysyłania obrazu:", error);
      setIsPhotoSending(false);
    } finally {
      setIsPhotoSending(false);
    }
  };

  const handleAddPoint = async (url: string) => {
    const filenameRegex = /[^/]+$/;
    const match = url.match(filenameRegex);

    if (match) {
      const filename = match[0];
      const nameMatch = filename.match(/_(.*)\./);
      if (nameMatch) {
        const clickedName = nameMatch[1];

        try {
          setIsPhotoSending(true);
          await axios.post("http://localhost:8000/points", {
            name: clickedName,
            user: user.name,
            game_mode: "is_photo",
          });
        } catch (e) {
          setIsPhotoSending(false);
          console.error("Error -> ", e);
        } finally {
          setIsPhotoSending(false);
          setIsPointAdded(true);
        }
      } else {
        console.error("Nie udało się znaleźć imienia w nazwie pliku");
      }
    } else {
      console.error("Nie udało się znaleźć nazwy pliku w podanym URL");
    }
  };

  const handleDownloadPhoto = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "downloaded_photo.jpg";
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div
      className="w-full h-screen flex flex-col justify-start items-center gap-6"
      style={{ marginTop: "15vh" }}
    >
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <div className="mb-10 flex flex-col text-center">
        <h1 className="text-2xl">Zdjęcia</h1>
        {isPointAdded ? (
          ""
        ) : (
          <p className="text-sm">
            Możesz dodać punkt za zdjęcie, które najbardziej Ci się podoba
          </p>
        )}
      </div>

      <div>
        {photos.map((item: IImage, index) => (
          <div key={index} className="p-4 relative">
            <Image src={item.url} alt={item.filename} />
            <span
              className="absolute top-4 left-4 bg-white p-1 rounded"
              onClick={() => handleDownloadPhoto(item.url, item.filename)}
            >
              <a href={item.url} download>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </span>
            {isPhotoSending || user.photo ? (
              ""
            ) : (
              <span
                className="absolute top-4 right-4 bg-white px-1 rounded text-green-600 text-2xl"
                onClick={() => handleAddPoint(item.url)}
              >
                +
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
        />

        {photo && (
          <div>
            <h2>Podgląd zdjęcia</h2>
            <Image src={photo} alt="Zdjęcie" style={{ width: "100%" }} />
          </div>
        )}

        {isPhotoSending ? (
          ""
        ) : (
          <button
            onClick={handleUpload}
            className="text-2xl mb-8 p-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
          >
            Wyślij zdjęcie
          </button>
        )}
      </div>
    </div>
  );
};

export default Images;
