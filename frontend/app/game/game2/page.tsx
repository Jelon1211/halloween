"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { bingoItems } from "@/app/data/bingo";

type BingoItem = {
  title: string;
  is_clicked: boolean;
};

export default function Game2() {
  const { user, setUser } = useUser();

  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);
  const [bingo, setBingo] = useState<BingoItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    const bingo = localStorage.getItem("bingo");
    if (!name) {
      router.push("/");
    }

    const getUser = async () => {
      const responseUser = await axios.get(
        `http://localhost:8000/player?name=${name}`
      );

      setIsPointAdded(responseUser.data.results[0][0].game2);
      setUser(responseUser.data.results[0][0]);
    };

    const shuffleBingo = () => {
      const shuffledBingo = [...bingoItems];

      for (let i = shuffledBingo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledBingo[i], shuffledBingo[j]] = [
          shuffledBingo[j],
          shuffledBingo[i],
        ];
      }

      const selectedBingoItems = shuffledBingo.slice(0, 6).map((item) => ({
        title: item,
        is_clicked: false,
      }));

      setBingo(selectedBingoItems);

      localStorage.setItem("bingo", JSON.stringify(selectedBingoItems));
    };

    if (!bingo || !bingo.length) {
      shuffleBingo();
    } else {
      const storedBingo = localStorage.getItem("bingo")
        ? JSON.parse(localStorage.getItem("bingo") as string)
        : [];
      setBingo(storedBingo);
    }

    getUser();
  }, [router, setUser]);

  const handleAddPoint = async () => {
    await axios.post("http://localhost:8000/points", {
      name: user.name,
      user: user.name,
      game_mode: "is_game_2",
    });

    setIsPointAdded(true);
  };

  const toggleBingoItem = (index: number) => {
    setBingo((prevBingo) =>
      prevBingo.map((item, i) =>
        i === index ? { ...item, is_clicked: !item.is_clicked } : item
      )
    );
  };

  useEffect(() => {
    if (bingo.length) {
      localStorage.setItem("bingo", JSON.stringify(bingo));
    }
  }, [bingo]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <div className="shadow-lg rounded-lg p-6 max-w-md">
        <div className="pb-6">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Halloween Bingo!
          </h1>
          <div className="text-center">
            Twoim zadaniem jest bacznie obserwować, co dzieje się dookoła, i
            zaznaczać na swojej karcie każdą sytuację, która faktycznie ma
            miejsce.
            <p className="p-1">
              Osoba, która zaznaczy całą kartę, zostanie naszym Mistrzem Grozy i
              otrzyma jeden punk! Zatem chwyć swoją kartę, obserwuj uważnie!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {bingo &&
            bingo.map((card, index) => (
              <div
                key={index}
                className={`p-4 border-2 cursor-pointer text-center ${
                  card.is_clicked ? "bg-lime-950 text-white" : "bg-gray-600"
                }`}
                onClick={() => toggleBingoItem(index)}
              >
                {card.title}
              </div>
            ))}
        </div>
      </div>
      {!isPointAdded ? (
        <button
          type="button"
          className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-center"
          onClick={handleAddPoint}
        >
          Bingo gotowe!
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
