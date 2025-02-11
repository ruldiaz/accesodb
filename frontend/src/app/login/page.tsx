"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMesage] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Enviar a dashboard si ya inició sesión
  useEffect(()=>{
    //const token = localStorage.getItem("token");
    const token = Cookies.get("token");
    console.log(token);
    if(token){
      router.push("/dashboard");
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    setSuccessMesage("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      

      setSuccessMesage("Credenciales correctas, accesando...");
      console.log("Estado actualizado:", successMessage);

      const data = await res.json();
      
      //localStorage.setItem("token", data.token);
      Cookies.set("token", data.token, { expires: 7, secure: process.env.NODE_ENV === "production" });
      //console.log("Token almacenado en localStorage:", data.token);

      setTimeout(()=>{
        router.push("/dashboard"); 
        console.log("Redirigiendo a /dashboard");
      },5000);
      

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      
      <div className="bg-black/[.05] dark:bg-white/[.06] p-6 rounded-lg shadow-lg w-80 sm:w-96 text-center">
        <h2 className="text-sm font-[family-name:var(--font-geist-mono)] text-gray-900 dark:text-gray-100">
          Ingresa los datos de acceso de tu cuenta
        </h2>
        <form className="mt-4 flex flex-col gap-4 text-sm font-[family-name:var(--font-geist-mono)]" onSubmit={handleLogin}>
          <input
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button className="bg-black/[.05] dark:bg-white/[.06] px-3 py-2 rounded font-semibold hover:bg-black/[.1] dark:hover:bg-white/[.12] transition" type="submit">
            Ingresar
          </button>
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <p className="mt-4 text-sm font-[family-name:var(--font-geist-mono)] text-gray-900 dark:text-gray-100">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Crea una cuenta gratis!
          </Link>
        </p>
      </div>
    </div>
  );
}
