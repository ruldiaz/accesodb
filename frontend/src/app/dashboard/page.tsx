"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter(); 

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login"); 
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/dashboard", {
          method: "GET",
          headers: {
            Authorization: token, 
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data.user); 
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

  const handleLogout = () => {
    localStorage.removeItem("token"); 
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
