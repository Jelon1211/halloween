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
          <h1 className="text-6xl font-bold mb-6">
            {user.character == "vampire"
              ? "Wampiry vs łowcy"
              : "Łowcy vs wampiry"}
          </h1>
          <div className="text-left">
            <p className="leading-relaxed">Klasa</p>
            <h4 className="text-2xl text-orange font-semibold mb-8">
              {user.character == "vampire" ? "Wampir" : "Łowca"}
            </h4>
            <p className="leading-relaxed">Cel</p>
            <h4 className="text-2xl text-orange font-semibold mb-8">
              {user.character == "vampire"
                ? "Nie daj się złapać łowcom i znajdź innego Wampira."
                : "Znajdź i zdemaskuj wampira."}
            </h4>

            <p className="mb-8">
              {user.character == "vampire"
                ? "Zostałeś przydzielony do jednej z grup - jesteś łowcą lub wampirem (jedyna prawilna opcja). Gra toczyć się będzie przez całą imprezę, a jako uczestnik musisz obserwować zachowania innych, formułować swoje podejrzenia i działać w tajemnicy, by zdobyć punkt"
                : "Zostałeś przydzielony do jednej z grup - jesteś łowcą (tym lepszym) lub wampirem. Gra toczyć się będzie przez całą imprezę, a jako uczestnik musisz obserwować zachowania innych, formułować swoje podejrzenia i działać w tajemnicy, by zdobyć punkt."}
            </p>

            <p className="mb-8">
              Tip dla Ciebie:{" "}
              <span className="font-semibold text-orange">
                {user.character == "vampire"
                  ? "Wampiry mają niepochamowaną potrzebę syczenia co jakiś czas. "
                  : "Łowcy używają mowy nienawiści wobec tych jebanych wampirów i z natury nie łączą się w grupy. "}
              </span>
              Ale to tylko wierzchołek góry lodowej
            </p>
            <p className="text-orange">
              {user.character == "vampire" ? (
                "Jako wampir, musisz szukać swoich i przekonać tych pierdolonych łowców, że jesteś jednym z nich - wtedy Cię nie złapią."
              ) : (
                <>
                  Jako Łowca, musisz znaleźć wampira oraz unikać innych Łowców{" "}
                  <span className="text-white">
                    (konflikt interesów i te sprawy)
                  </span>
                </>
              )}
            </p>
            {user.character == "vampire" ? (
              <p className="mt-8">
                Aby zidentyfikować innego wampira, masz tylko jedną szansę na
                zapytanie “
                <span className="font-semibold text-orange">
                  Czy jesteś wampirem?
                </span>
                ”. Inni gracze będą Cię pytać o to samo -{" "}
                <span className="font-semibold text-orange">
                  pamiętaj, aby odpowiadać szczerze.
                </span>
              </p>
            ) : (
              <p className="mt-8">
                Aby zidentyfikować wampira, masz tylko jedną szansę na zapytanie
                “
                <span className="font-semibold text-orange">
                  Czy jesteś wampirem?
                </span>
                ”. Inni gracze będą Cię pytać o to samo -{" "}
                <span className="font-semibold text-orange">
                  pamiętaj, aby odpowiadać szczerze.
                </span>
              </p>
            )}
            {user.character == "vampire" ? (
              <p className="mt-8">
                Jeśli znajdziesz innego Wampira, otrzymujesz punkt i kończysz
                grę. Jeśli trafiłeś na łowcę, przegrywasz i nie otrzymujesz
                punktu. Cokolwiek się wydarzy, nie bierzesz już później udziału
                w grze i nie odpowiadasz już na pytania o klasę.
              </p>
            ) : (
              <p className="mt-8">
                Jeśli znajdziesz wampira, otrzymujesz punkt i kończysz grę.
                Jeśli trafiłeś na Łowcę, przegrywasz i nie otrzymujesz punktu.
                Cokolwiek się wydarzy, nie bierzesz już później udziału w grze i
                nie odpowiadasz już na pytania o klasę.
              </p>
            )}
            <p className="mt-8">Gra kończy się po ustalonym czasie.</p>
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
              ? "Znalazłem/am innego Wampira"
              : "Znalazłem/am wampira!"}
          </button>

          <button
            type="button"
            className="text-2xl w-full border border-orange text-orange p-4 font-medium rounded-lg text-center text-black"
            onClick={() => handleAddPoint(false)}
          >
            {user.character == "vampire"
              ? "Znalazłem/am łowcę"
              : "Znalazłem/am innego Łowcę"}
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="mt-8">
        {user.character == "hunter" ? (
          <Image
            src="/images/hunter.png"
            width={500}
            height={500}
            alt="pumpkin"
          />
        ) : (
          <Image
            src="/images/vampire.png"
            width={500}
            height={500}
            alt="pumpkin"
          />
        )}
      </div>
    </div>
  );
}
