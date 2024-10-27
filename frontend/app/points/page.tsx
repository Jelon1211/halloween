"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import axios from "axios";
import Image from "next/image";

interface IUser {
  id: number;
  name: string;
  points: number;
  is_voted: boolean;
}

export default function Points() {
  const [users, setUsers] = useState<IUser[]>([]);

  const [canVote, setCanVote] = useState<boolean>(true);

  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      router.push("/");
    }
    const getUser = async () => {
      const responseUser = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${name}`
      );
      setUser(responseUser.data.results[0][0]);
    };

    const getAllUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users`
        );
        const data = await response;

        const filteredUsers = data?.data?.results?.[0]?.filter(
          (item: IUser) => item.name !== name
        );

        setUsers(filteredUsers || []);
      } catch (error) {
        console.error("Błąd podczas pobierania listy użytkowników:", error);
      }
    };

    Promise.all([getUser(), getAllUsers()])
      .then(() => console.log("git"))
      .catch((e) => console.log("error ->", e));
  }, [router, setUser]);

  useEffect(() => {
    const asyncFunc = async () => {
      getUserData();
    };
    asyncFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/points?name=${user.name}`
      );
      const data = await response;

      const isVoted = data?.data?.results?.[0]?.[0]?.is_voted;

      if (isVoted) {
        setCanVote(false);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };

  const addPoint = async (clickedName: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/points`, {
        name: clickedName,
        user: user.name,
        game_mode: "is_voted",
      });

      const getAllUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users`
          );
          const data = await response;

          const filteredUsers = data?.data?.results?.[0]?.filter(
            (item: IUser) => item.name !== user.name
          );
          setUsers(filteredUsers || []);
        } catch (error) {
          console.error("Błąd podczas pobierania listy użytkowników:", error);
        }
      };

      setCanVote(false);
      getAllUsers();
    } catch (error) {
      console.error("Błąd podczas dodawania punktu:", error);
    }
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

      <h1 className="text-2xl py-6">Punktacja</h1>
      <div className="w-full overflow-y-auto" style={{ maxHeight: "75vh" }}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Imię
                </th>
                <th scope="col" className="px-6 py-3">
                  Punkty
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  <span className="sr-only">+</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4 text-center">{item.points}</td>
                  <td className="px-6 py-4 text-center">
                    {canVote ? (
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => addPoint(item.name)}
                      >
                        <svg
                          className="h-8 w-8 text-green-500"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8">
            <Image
              src="/images/skull9.png"
              width={500}
              height={500}
              alt="pumpkin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
