"use client";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

import axios from "axios";

export default function Login() {
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

      Promise.all([getUser()])
        .then(() => console.log("git"))
        .catch((e) => console.log("error -> ", e));
    } else {
      router.push("/");
    }
  }, [router, setUser]);

  const handleInit = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/init`);
  };
  const handleReset = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/reset`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <div className="w-full flex justify-between px-8 fixed top-0 bg-black py-4">
        <div className="text-xl">{user.name}</div>
        <div className="text-xl">{user.points}</div>
        <div className="text-xl text-orange">#{user.character}</div>
      </div>
      <div className="-mb-28">
        <Image
          src="/images/skull1.png"
          width={500}
          height={500}
          alt="pumpkin"
        />
      </div>
      <div className="m-6">
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-black bg-orange rounded text-center font-medium"
          onClick={() => router.push("/game/game1")}
        >
          Skrzynka mailowa (1)
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-black bg-orange rounded text-center font-medium"
          onClick={() => router.push("/game/game2")}
        >
          Bingo
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-black bg-orange rounded text-center font-medium"
          onClick={() => router.push("/game/game3")}
        >
          Łowcy vs Wampiry
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-black bg-orange rounded text-center font-medium"
          onClick={() => router.push("/game/game4")}
        >
          Grupowe
        </button>
      </div>
      <div className="m-6 flex gap-28">
        <button
          type="button"
          className="text-2xl w-full mb-8 p-6 text-orange rounded text-center font-medium border border-orange"
          onClick={() => router.push("/points")}
        >
          Punkty
        </button>
        <button
          type="button"
          className="text-2xl w-full mb-8 p-6 text-orange rounded text-center font-medium border border-orange"
          onClick={() => router.push("/images")}
        >
          Zdjęcia
        </button>
      </div>
      {user.name == "jelon" ? (
        <>
          <div>
            <button
              type="button"
              className="text-2xl mb-8 p-4 text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-center dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              onClick={handleInit}
            >
              Init
            </button>
            <button
              type="button"
              className="text-2xl mb-8 p-4 text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-center dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
