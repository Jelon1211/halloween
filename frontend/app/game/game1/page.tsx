"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

import axios from "axios";

export default function Game1() {
  const { user, setUser } = useUser();
  const [target, setTarget] = useState<string | null>(null);
  const [quest, setQuest] = useState<string | null>(null);
  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      router.push("/");
      return;
    }
    const getUser = async () => {
      const responseUser = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${name}`
      );
      setUser(responseUser.data.results[0][0]);
    };

    const getTarget = async () => {
      const target = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/game_1?name=${name}`
      );
      console.log(target);

      const is_voted = target.data.results[0][0].game_voted ? true : false;

      setIsPointAdded(is_voted);
      setTarget(target.data.results[0][0].target_name);
      setQuest(target.data.results[0][0].assigned_quest);
    };
    getTarget();
    getUser();
  }, [router, setUser]);

  const handleAddPoint = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
      name: user.name,
      user: user.name,
      game_mode: "is_game_1",
    });

    setIsPointAdded(true);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between items-center mt-20">
      <div className="w-full flex justify-between px-8 fixed top-0 bg-black py-4">
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
        <h1 className="text-7xl font-semibold mb-4">Skrzynka mailowa</h1>
        <div className="text-lg flex flex-col gap-4">
          <p>Witamy!!!!!!!11</p>
          <p>
            Pamiętasz tę jedną, bardzo dziwną z firm, do których wysłałeś/aś CV?
            Wtedy Ci nie odpisaliśmy, ale okazuje się, że mail trafił do spamu
            czy coś. Udało się!
          </p>
          <p>
            Przechodzisz do kolejnego etapu rekrutacji. Zadanie jest proste i
            jasne. Jak nie, to{" "}
            <span className="text-orange font-semibold">
              uważaj, bo będziesz następny. Nasza firma ma wielu pracowników.
            </span>
          </p>
        </div>
        <div className="mt-4 p-4 rounded-lg">
          <p className="text-lg pb-4">Twój cel to:</p>
          <p className="text-3xl font-semibold text-orange">{target}</p>
        </div>
        <p className="text-4xl my-4 italic">{quest}</p>

        <div className="py-4 flex flex-col gap-4">
          <p>
            Liczymy na Twój profesjonalizm. Ta firma to wcale nie jest
            przykrywka dla międzynarodowej organizacji przestępczej{" "}
            {":)))))))) ;)"}
            :P{" "}
          </p>
          <p>Anyway.</p>{" "}
          <p>Zrobione? Daj nam znać, a przy okazji dostaniesz punkta w grze.</p>{" "}
          <p>Pozdrawiamy, s.j. ZombiesCorp Inc. sp. z. o.o. KRS: 666</p>
        </div>
      </div>
      {!isPointAdded ? (
        <button
          type="button"
          className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black font-semibold"
          onClick={handleAddPoint}
        >
          Cel ujęty
        </button>
      ) : (
        ""
      )}
      <div className="">
        <Image
          src="/images/skull2.png"
          width={500}
          height={500}
          alt="pumpkin"
        />
      </div>
    </div>
  );
}
