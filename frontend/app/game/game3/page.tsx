"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";

export default function Login() {
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
        `http://localhost:8000/player?name=${name}`
      );

      setIsPointAdded(responseUser.data.results[0][0].game3);
      setUser(responseUser.data.results[0][0]);
    };

    getUser();
  }, []);

  const handleAddPoint = async (isPoint: boolean) => {
    await axios.post("http://localhost:8000/points", {
      name: isPoint ? user.name : "BRAK",
      user: user.name,
      game_mode: "is_game_3",
    });

    setIsPointAdded(true);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6 text-white">
      <div className="absolute left-10 top-10 text-xl">{user.name}</div>
      <div className="absolute left-70 top-10 text-xl">{user.character}</div>
      <div className="absolute left-80 top-10 text-xl">{user.points}</div>

      <div className="shadow-lg rounded-lg p-6 max-w-md mt-80">
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
                odnajdzie innego wampira (Uczestnij wciska przycisk "Cel
                ukończony!").
              </li>
              <li>
                Jeśli uczestnik udzieli błędnej odpowiedzi, nie zdobywa punktu.
                (Wciska przycisk, "Brak punktu")
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
        <>
          <button
            type="button"
            className="text-2xl w-full p-4 text-white bg-gradient-to-r from-purple-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
            onClick={() => handleAddPoint(true)}
          >
            Cel ukończony!
          </button>

          <button
            type="button"
            className="text-2xl w-full mb-8 p-4 text-white bg-gradient-to-r from-purple-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-center"
            onClick={() => handleAddPoint(false)}
          >
            Brak punktu
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
