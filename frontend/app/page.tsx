"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [errorData, setErrorData] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      router.push("/game");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const sanitizedFirstName = formData.firstName
      .toLowerCase()
      .replace(/\s+/g, "");
    const sanitizedLastName = formData.lastName
      .toLowerCase()
      .replace(/\s+/g, "");

    const sanitizedName = sanitizedFirstName + sanitizedLastName;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/player?name=${sanitizedName}`
      );

      console.log(response);

      if (response.data.results[0][0].character) {
        setErrorData("Użytkownik już istnieje, zaloguj się!");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/route`,
        {
          name: sanitizedName,
        }
      );

      if (response.status === 201) {
        localStorage.setItem("name", sanitizedName);
        router.push("/game");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorData("Użytkownik o takiej nazwie już istnieje");
      } else {
        setErrorData("Wystąpił błąd. Spróbuj ponownie.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      {errorData ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{errorData}</span>
        </div>
      ) : (
        ""
      )}
      <h1 className="text-2xl">Wpisz swoje imię i nazwisko</h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="flex px-8">
          <label
            htmlFor="firstName"
            className="text-xl flex items-center w-full"
          >
            Imię:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex px-8 py-4 mb-6">
          <label
            htmlFor="lastName"
            className="text-xl flex items-center w-full"
          >
            Nazwisko:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mx-6 my-6 text-xl focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Zarejestruj
        </button>
        <div
          className="mx-6 my-6 text-xl text-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm py-2.5"
          onClick={() => router.push("/login")}
        >
          Zaloguj
        </div>
      </form>
    </div>
  );
}
