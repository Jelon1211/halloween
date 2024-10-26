"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { dontStart, expert, thinkAbout } from "@/app/data/game4";

interface IGameTopic {
  game1: string;
  game2: string;
  game3: string;
}

export default function Game4() {
  const { user, setUser } = useUser();
  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);
  const [clickedGame, setClickedGame] = useState<number>(0);
  const [gameTopic, setGameTopic] = useState<IGameTopic>({
    game1: "",
    game2: "",
    game3: "",
  });

  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      router.push("/");
    }

    const getUser = async () => {
      const responseUser = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${name}`
      );

      setIsPointAdded(responseUser.data.results[0][0].game4);
      setUser(responseUser.data.results[0][0]);
    };

    const getRandomTopic = () => {
      const randomGame1 = Math.floor(Math.random() * dontStart.length);
      const randomGame2 = Math.floor(Math.random() * thinkAbout.length);
      const randomGame3 = Math.floor(Math.random() * expert.length);

      setGameTopic((prevState) => ({
        ...prevState,
        game1: dontStart[randomGame1],
        game2: thinkAbout[randomGame2],
        game3: expert[randomGame3],
      }));
    };

    getRandomTopic();
    getUser();
  }, [router, setUser]);

  const handleAddPoint = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
      name: user.name,
      user: user.name,
      game_mode: "is_game_4",
    });

    setIsPointAdded(true);
  };

  const renderGameDescription = () => {
    switch (clickedGame) {
      case 1:
        return (
          <div>
            <h2 className="text-center text-2xl p-4">Jak ja nienawidzę!</h2>
            <p className="text-center">
              to gra, w której gracze muszą z pasją narzekać na dowolny, często
              zupełnie niewinny temat. Im bardziej przesadzone i dramatyczne
              narzekanie, tym lepiej!
            </p>
            <p className="text-center mt-6">
              Twój temat:
              <span className="italic text-xl text-emerald-400">
                {gameTopic.game1}
              </span>
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-center text-2xl p-4">Illuminati</h2>
            <p className="text-center">
              Gracze muszą wymyślać najbardziej absurdalne teorie spiskowe na
              losowe tematy. Każdy uczestnik stara się bronić swoich pomysłów,
              wplatając w nie szalone wątki, podczas gdy inni gracze wtrącają
              się, zmuszając go do jeszcze bardziej kreatywnych wyjaśnień!
            </p>
            <p className="text-center mt-6">
              Twój temat:
              <span className="italic text-xl text-emerald-400">
                {gameTopic.game2}
              </span>
            </p>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-center text-2xl p-4">Największy ekspert</h2>
            <p className="text-center">
              Gracze udają ekspertów od najbardziej dziwacznych i losowych
              dziedzin. Reszta uczestników zadaje pytania, a
              <strong className="italic">ekspert</strong> musi z przekonaniem
              odpowiadać, wymyślając odpowiedzi na bieżąco. Czy wiesz, jak
              trenować smoki albo jak działa teleportacja psów?
            </p>
            <p className="text-center mt-6">
              Twój temat:
              <span className="italic text-xl text-emerald-400">
                {gameTopic.game3}
              </span>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 text-white">
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <div className="shadow-lg rounded-lg p-6 max-w-md mt-80">
        <div className="pb-6">
          {clickedGame ? (
            <div>
              {renderGameDescription()}
              <button
                type="button"
                className="mt-16 text-2xl w-full p-4 text-white bg-gradient-to-r from-red-500 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-center"
                onClick={() => setClickedGame(0)}
              >
                Wróć
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-center"
                onClick={() => setClickedGame(1)}
              >
                Jak ja nienawidzę!
              </button>
              <button
                type="button"
                className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-center"
                onClick={() => setClickedGame(2)}
              >
                Illuminati
              </button>
              <button
                type="button"
                className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
                onClick={() => setClickedGame(3)}
              >
                Największy ekspert
              </button>
            </div>
          )}
        </div>
      </div>

      {!isPointAdded ? (
        <>
          <button
            type="button"
            className="text-2xl w-full p-4 text-white bg-gradient-to-r from-purple-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
            onClick={() => handleAddPoint()}
          >
            Punk!
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
