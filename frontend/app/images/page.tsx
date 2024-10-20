"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

const Images = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState([]);
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
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
    formData.append("photo", compressedFile);

    try {
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
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col justify-start items-center gap-6"
      style={{ marginTop: "15vh" }}
    >
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <h1 className="text-2xl mb-10">Zdjęcia</h1>

      <div>
        {photos.map((item, index) => (
          <div key={index} className="p-4">
            <img src={item.url} alt={item.filename} />
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
            <img src={photo} alt="Zdjęcie" style={{ width: "100%" }} />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="text-2xl mb-8 p-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
        >
          Wyślij zdjęcie
        </button>
      </div>
    </div>
  );
};

export default Images;
