"use client";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl">Twój login</h1>
      {user}
    </div>
  );
}
