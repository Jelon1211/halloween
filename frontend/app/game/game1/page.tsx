"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";

export default function Login() {
  const { user, setUser } = useUser();
  const [target, setTarget] = useState<string | null>(null);
  const [quest, setQuest] = useState<string | null>(null);
  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      router.push("/");
    }
    const getUser = async () => {
      const responseUser = await axios.get(
        `http://localhost:8000/player?name=${name}`
      );
      setUser(responseUser.data.results[0][0]);
    };

    const getTarget = async () => {
      const target = await axios.get(
        `http://localhost:8000/game_1?name=${name}`
      );
      console.log(target);

      const is_voted = target.data.results[0][0].game_voted ? true : false;

      setIsPointAdded(is_voted);
      setTarget(target.data.results[0][0].target_name);
      setQuest(target.data.results[0][0].assigned_quest);
    };
    getTarget();
    getUser();
  }, []);

  const handleAddPoint = async () => {
    await axios.post("http://localhost:8000/points", {
      name: user.name,
      user: user.name,
      game_mode: "is_game_1",
    });

    setIsPointAdded(true);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <div className="shadow-lg rounded-lg p-6 max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Twoje zadanie</h1>
        <p className="text-lg">
          Otrzymałeś tajną misję! Twoim celem jest{" "}
          <span className="font-bold">{target}</span>. Aby wyeliminować tę osobę
          z gry, musisz wykonać następujące zadanie:
        </p>
        <div className="mt-4 p-4 rounded-lg">
          <p className="text-lg italic">{quest}</p>
        </div>
        <p className="mt-4 text-lg">
          Po wykonaniu zadania zgłoś to Twojej ofierze oraz nacisnij przycisk,
          żeby dodać sobie punkt (nie klikaj przed zakończeniem zadania).
          Pamiętaj, że inni gracze mogą mieć zadania na ciebie! Przetrwaj jak
          najdłużej, aby wygrać.
        </p>
      </div>
      {!isPointAdded ? (
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-center"
          onClick={handleAddPoint}
        >
          Dodaj punkt
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
