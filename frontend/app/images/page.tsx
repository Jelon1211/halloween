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
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${name}`
        );
        setUser(responseUser.data.results[0][0]);
      };

      const getPhotos = async () => {
        const responsePhotos = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/upload`
        );
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
      maxSizeMB: 5,
      maxWidthOrHeight: 1600,
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
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/upload`,
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
      setPhoto(null);
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
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
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
      className="w-full flex flex-col justify-start items-center gap-6"
      style={{ marginTop: "15vh" }}
    >
      <div className="w-full flex justify-between px-8 fixed top-0 bg-black py-6">
        <div className="text-xl">{user.name}</div>
        <div className="text-xl">{user.points}</div>
        <div className="text-xl text-orange">#{user.character}</div>
      </div>
      <div
        className="flex gap-4 justify-start w-full p-6"
        onClick={() => router.push("/game")}
      >
        <svg
          fill="#ffffff"
          height="25px"
          width="25px"
          version="1.1"
          id="Layer_1"
          viewBox="0 0 330 330"
          xmlSpace="preserve"
          className="rotate-180"
        >
          <path
            id="XMLID_222_"
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"
          />
        </svg>
        <p>Wróć</p>
      </div>

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

      <div className="flex flex-col">
        <div>
          Otwórz aparat
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
          />
        </div>
        <div>
          Otwórz galerię
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
          />
        </div>

        {photo && (
          <div>
            <h2>Podgląd zdjęcia</h2>
            <Image
              src={photo}
              alt="Zdjęcie"
              style={{ width: "100%" }}
              width={400}
              height={400}
            />
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

      <div className="grid grid-cols-3 gap-4 overflow-hidden">
        {photos.map((item: IImage, index) => (
          <div key={index} className="relative">
            <div>
              <img
                src={item.url}
                alt={item.filename}
                className="w-full h-auto"
              />
              <span
                className="absolute top-1 left-1 w-full h-full"
                onClick={() => handleDownloadPhoto(item.url, item.filename)}
              >
                <a href={item.url} download></a>
              </span>
            </div>
            {isPhotoSending || user.photo ? (
              ""
            ) : (
              <span
                className="text-center flex justify-center py-2"
                onClick={() => handleAddPoint(item.url)}
              >
                <svg
                  fill="#ffffff"
                  height="25px"
                  width="25px"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 471.701 471.701"
                  xmlSpace="preserve"
                >
                  <g>
                    <path
                      d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
		c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
		l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
		C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
		s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
		c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
		C444.801,187.101,434.001,213.101,414.401,232.701z"
                    />
                  </g>
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
