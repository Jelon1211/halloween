"use client";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUser(name);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      <div className="absolute left-10 top-10 text-xl">{user}</div>
      <div className="m-6">
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-center"
        >
          Gra 1
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-center"
        >
          Gra 2
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
        >
          Gra 3
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-center"
        >
          Gra 4
        </button>
      </div>
      <div className="m-6 flex gap-28">
        <button
          type="button"
          className="text-2xl mb-8 p-4 text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
          onClick={() => router.push("/points")}
        >
          Punkty
        </button>
        <button
          type="button"
          className="text-2xl mb-8 p-4 text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-center dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
          onClick={() => router.push("/images")}
        >
          Zdjęcia
        </button>
      </div>
    </div>
  );
}
