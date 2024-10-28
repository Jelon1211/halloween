"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { bingoItems } from "@/app/data/bingo";
import Image from "next/image";

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
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${name}`
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
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
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
    <div className="w-full flex flex-col justify-between items-center mt-20">
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
      <div className="shadow-lg rounded-lg p-6 max-w-md">
        <div className="pb-6">
          <h1 className="text-6xl font-semibold mb-12">Halloween Bingo!</h1>
          <div className="flex flex-col gap-4">
            <p>
              {" "}
              Często zdarza Ci się bacznie obserwować innych ludzi? Nie?
              Najwyższa pora zacząć.
            </p>

            <p>Zaznacz, co zobaczyłeś/aś. </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {bingo &&
            bingo.map((card, index) => (
              <div
                key={index}
                className={`p-4 border-2 cursor-pointer text-center flex flex-col justify-center items-center ${
                  card.is_clicked ? "bg-[#030c1b] text-white" : "bg-gray-600"
                }`}
                onClick={() => toggleBingoItem(index)}
              >
                {card.is_clicked ? (
                  <Image
                    src="/images/check.png"
                    width={50}
                    height={50}
                    alt="pumpkin"
                  />
                ) : (
                  card.title
                )}
              </div>
            ))}
        </div>
      </div>
      {!isPointAdded ? (
        <button
          type="button"
          className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
          onClick={handleAddPoint}
        >
          Widziałem/am już wszystko
        </button>
      ) : (
        ""
      )}
      <div className="">
        <Image
          src="/images/skull3.png"
          width={500}
          height={500}
          alt="pumpkin"
        />
      </div>
    </div>
  );
}
