"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import axios from "axios";

export default function Points() {
  const [users, setUsers] = useState([]);

  const [canVote, setCanVote] = useState<boolean>(true);

  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUser(name);
    } else {
      router.push("/");
    }

    const getUserData = async () => {
      const response = axios.get(`http://localhost:8000/points?name=${name}`);
      const data = await response;
      const isVoted = data.data.results[0][0].is_voted;
      if (isVoted !== 0) {
        setCanVote(false);
      }
    };
    const getAllUsers = async () => {
      const response = axios.get(`http://localhost:8000/users`);
      const data = await response;
      setUsers(data.data.results[0]);
    };

    getUserData();
    getAllUsers();
  }, []);

  const addPoint = () => {
    const response = axios.post("http://localhost:8000/points", {
      name: user,
    });
  };

  return (
    <div
      className="w-full h-screen flex flex-col justify-start items-center gap-6"
      style={{ marginTop: "25vh" }}
    >
      <div className="absolute left-5 top-5 text-xl">{user}</div>
      <h1 className="text-2xl fixed top-[15%]">Punktacja</h1>
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
                        onClick={addPoint}
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
        </div>
      </div>
    </div>
  );
}
