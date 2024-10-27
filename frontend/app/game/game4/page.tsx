"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { dontStart, expert, thinkAbout } from "@/app/data/game4";
import Image from "next/image";

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
            <h2 className=" text-6xl py-4">Jak ja nienawidzę!</h2>
            <p className="">
              Przed Tobą najbardziej polska z gier. Wciel się w Ferdka
              Kiepieskiego i wspólnie z sąsiadami ponarzekajcie sobie na zapas.
            </p>
            <p className="flex flex-col mt-6">
              Temat:
              <span className="italic text-3xl text-orange font-semibold mb-6">
                {gameTopic.game1}
              </span>
              <p className="mb-10">Ponarzekane? No to super.</p>
            </p>
            {!isPointAdded ? (
              <>
                <button
                  type="button"
                  className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-black font-semibold"
                  onClick={() => handleAddPoint()}
                >
                  No to super.
                </button>
              </>
            ) : (
              ""
            )}
            <div className=" pt-12">
              <Image
                src="/images/skull5.png"
                width={500}
                height={500}
                alt="pumpkin"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className=" text-6xl py-4">Illuminati</h2>
            <p className="">
              Celem gry jest wymyślenie najbardziej absurdalnej teorii
              spiskowej.
            </p>
            <p className="flex flex-col mt-6">
              Temat:
              <span className="italic text-3xl text-orange font-semibold mb-6">
                {gameTopic.game2}
              </span>
              <p className="mb-10">
                Inni gracze zadają pytania, mogą się wtrącać i podważać.
                Przekonaj grupę, że Twoja wiedza jest najtwojsza.
              </p>
            </p>
            {!isPointAdded ? (
              <>
                <button
                  type="button"
                  className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-black font-semibold"
                  onClick={() => handleAddPoint()}
                >
                  Przekonał/a, buduję kult.
                </button>
              </>
            ) : (
              ""
            )}
            <div className=" pt-12">
              <Image
                src="/images/skull6.png"
                width={500}
                height={500}
                alt="pumpkin"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className=" text-6xl py-4">Największy ekspert</h2>
            <p className="">Jesteś ekspertem. Ekscentrycznym, ale genialnym.</p>
            <p className="flex flex-col mt-6">
              Twoja dziedzina:
              <span className="italic text-3xl text-orange font-semibold mb-6">
                {gameTopic.game3}
              </span>
              <p className="mb-10">
                Opowiedz o swojej dziedzinie i odpowiedz na wszelkie pytania,
                zachowując pełen profesjonalizm.
              </p>
              <p className="mb-10">
                Po wykładzie musisz chyba jednak przyznać, że w tym kraju nie ma
                pracy dla ludzi z Twoim wykształceniem.{" "}
              </p>
            </p>
            {!isPointAdded ? (
              <>
                <button
                  type="button"
                  className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-black font-semibold"
                  onClick={() => handleAddPoint()}
                >
                  Przynajmniej punkt jest
                </button>
              </>
            ) : (
              ""
            )}
            <div className=" pt-12">
              <Image
                src="/images/skull7.png"
                width={500}
                height={500}
                alt="pumpkin"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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

      <div className="w-full shadow-lg rounded-lg p-6 max-w-md mt-4">
        <div className="pb-6">
          {clickedGame ? (
            ""
          ) : (
            <h1 className="text-6xl font-semibold pb-12">Grupowe</h1>
          )}

          {clickedGame ? (
            <div>{renderGameDescription()}</div>
          ) : (
            <div className="flex flex-col gap-6 w-fulll">
              <button
                type="button"
                className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
                onClick={() => setClickedGame(1)}
              >
                Jak ja nienawidzę!
              </button>
              <button
                type="button"
                className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
                onClick={() => setClickedGame(2)}
              >
                Illuminati
              </button>
              <button
                type="button"
                className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
                onClick={() => setClickedGame(3)}
              >
                Największy ekspert
              </button>
            </div>
          )}
        </div>
      </div>

      {clickedGame ? (
        ""
      ) : (
        <div className="">
          <Image
            src="/images/skull4.png"
            width={500}
            height={500}
            alt="pumpkin"
          />
        </div>
      )}
    </div>
  );
}
