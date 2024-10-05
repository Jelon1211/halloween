"use client";
import axios from "axios";
import router from "next/router";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedFirstName = formData.firstName
      .toLowerCase()
      .replace(/\s+/g, "");
    const sanitizedLastName = formData.lastName
      .toLowerCase()
      .replace(/\s+/g, "");

    try {
      const response = await axios.post("http://localhost:8000/route", {
        name: sanitizedFirstName + sanitizedLastName,
      });

      if (response.status === 201) {
        console.log(response);
        router.push("/game");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
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
          Zatwierdź
        </button>
        <div className="mx-6 my-6 text-xl text-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm py-2.5">
          Zaloguj
        </div>
      </form>
    </div>
  );
}
