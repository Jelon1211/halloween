"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Points() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [errorData, setErrorData] = useState<string>("");
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUser(name);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      <div className="absolute left-10 top-10 text-xl">{user}</div>
      <h1 className="text-2xl">Punktacja</h1>
      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
      <div>
        <div>
          <div>name</div>
          <div>points</div>
          <div>+</div>
        </div>
      </div>
    </div>
  );
}
