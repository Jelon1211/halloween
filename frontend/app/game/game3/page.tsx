"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import Image from "next/image";

export default function Game3() {
  const { user, setUser } = useUser();

  const [isPointAdded, setIsPointAdded] = useState<boolean>(false);

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

      setIsPointAdded(responseUser.data.results[0][0].game3);
      setUser(responseUser.data.results[0][0]);
    };

    getUser();
  }, [router, setUser]);

  const handleAddPoint = async (isPoint: boolean) => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
      name: isPoint ? user.name : "BRAK",
      user: user.name,
      game_mode: "is_game_3",
    });

    setIsPointAdded(true);
  };

  return (
    <div className="w-full flex flex-col flex flex-col justify-between items-center mt-20">
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
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
            Łowcy i Wampiry
          </h1>
          <div className="text-left space-y-4">
            <p className="leading-relaxed text-center">
              W tej pełnej emocji i tajemniczej grze Halloweenowej, każdy z
              uczestników wciela się w jedną z dwóch ról: łowcę wampirów lub
              wampira. Zadaniem łowców jest wykrycie i zdemaskowanie wampirów,
              natomiast wampiry muszą unikać złapania, przekonując innych, że są
              łowcami. Gra toczy się przez całą imprezę, a uczestnicy muszą
              uważnie obserwować zachowania innych, formułować swoje podejrzenia
              i działać w tajemnicy, by zdobyć punkt.
            </p>

            <h2 className="text-xl font-semibold text-yellow-300">Zasady:</h2>
            <ul className="list-disc list-inside">
              <li>
                Na początku gry każdy został przydzielony do łowców lub
                wampirów. Te informacje są tajne i nikt nie może zdradzić swojej
                tożsamości.
              </li>
              <li>
                W ciągu imprezy, gracze mogą podejść do innego uczestnika i
                zadać mu tylko jedno pytanie: „Czy jesteś wampirem/łowcą?”.
              </li>
              <li>
                Jeśli zgadną, otrzymują punkt: łowca zdobywa punkt, jeśli
                poprawnie zidentyfikuje wampira, a wampir zdobywa punkt, jeśli
                odnajdzie innego wampira (Uczestnij wciska przycisk &quot;Cel
                ukończony!&ldquo;).
              </li>
              <li>
                Jeśli uczestnik udzieli błędnej odpowiedzi, nie zdobywa punktu.
                (Wciska przycisk, &quot;Brak punktu&ldquo;)
              </li>
              <li>
                Gra kończy się po ustalonym czasie, a wygrywa gracz z największą
                liczbą punktów.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-yellow-300">Cele:</h2>
            <p className="leading-relaxed">
              <strong>Łowcy:</strong> Znajdź i zdemaskuj wszystkie wampiry.
              <br />
              <strong>Wampiry:</strong> Przekonaj innych, że jesteś jednym z
              łowców i znajdź innych wampirów.
            </p>
          </div>
        </div>
      </div>

      {!isPointAdded ? (
        <div className="flex flex-col gap-6">
          <button
            type="button"
            className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
            onClick={() => handleAddPoint(true)}
          >
            {user.character == "vampire"
              ? "Znalazłem/am innego wampira"
              : "Znalazłem/amm wampira!"}
          </button>

          <button
            type="button"
            className="text-2xl w-full bg-orange p-4 font-medium rounded-lg text-center text-black"
            onClick={() => handleAddPoint(false)}
          >
            Znalazłem/am łowcę
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="mt-8">
        <Image
          src="/images/skull8.png"
          width={500}
          height={500}
          alt="pumpkin"
        />
      </div>
    </div>
  );
}
