"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";

interface APIError {
  msg: string;
}


export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(()=>{
    const token = Cookies.get("token");
    //const token = localStorage.getItem("token");
    if(token){
      router.push("/dashboard");
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: {errors?: APIError[]; error?: string} = await res.json();

      if (!res.ok){
        if(data.errors){
          console.log(data.errors);
          const errorMessages = data.errors.map((err) => err.msg);
          setError(errorMessages);
          return;
        }else{
          setError([data.error || "Error, intente de nuevo."]);
          return;
        }
        
      } 

      setSuccessMessage("Usuario registrado con éxito.");

      setTimeout(()=>{
        router.push("/login");
      },2000);

    } catch (err) {
      setError([err instanceof Error ? err.message : "Error desconocido"]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 bg-gray-100 dark:bg-gray-900">
      <div className="bg-black/[.05] dark:bg-white/[.06] p-6 rounded-lg shadow-lg w-80 sm:w-96 text-center">
        <h2 className="text-sm font-[family-name:var(--font-geist-mono)] text-gray-900 dark:text-gray-100">
          Crea una cuenta nueva
        </h2>
        {error.length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2">{successMessage}</p>
        )}
        <form className="mt-4 flex flex-col gap-4 text-sm font-[family-name:var(--font-geist-mono)]" onSubmit={handleSubmit}>
          <input
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="Correo"
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button className="bg-black/[.05] dark:bg-white/[.06] px-3 py-2 rounded font-semibold hover:bg-black/[.1] dark:hover:bg-white/[.12] transition" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
