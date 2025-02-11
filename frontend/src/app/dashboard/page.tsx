"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<User | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter(); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      //const token = localStorage.getItem("token");
      const token = Cookies.get("token");
      console.log("dashboard token: ", token);
      if (!token) {
        router.replace("/login"); 
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/dashboard`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token, 
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data.user); 
          setName(data.user.name);
          setEmail(data.user.email);
        } else {
          router.replace("/login"); 
        }
      } catch (error) {
        console.error(error);
        router.replace("/login"); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchDashboard();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent)=>{
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const res = await fetch(`${API_URL}/api/users/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: token || "",
          "Content-Tpe": "application/json"
        },
        body: JSON.stringify({name, email}),
      });
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
      alert("Error al actualizar usuario");
    }
  }

  const handleLogout = () => {
    //localStorage.removeItem("token"); 
    Cookies.remove("token");
    router.push("/"); 
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  };

  return (
    <div className="p-2 text-sm font-[family-name:var(--font-geist-mono)]"> {/* Aplica la fuente también aquí */}
      <h1 className="text-center mt-5">Interfaz de usuario</h1>
      {userData ? (
        <div className="space-y-4 p-20 text-center mt-10">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm">Nombre: </label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Correo electrónico:</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 w-full" />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar cambios</button>
          </form>
          <p><strong>Id:</strong> {userData.id}</p>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Correo electrónico:</strong> {userData.email}</p>
          <p><strong>Registrado desde:</strong> {formatDate(userData.createdAt)}</p>
        </div>
      ) : (
        <p>No se pudo cargar la información del usuario.</p>
      )}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleLogout}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
