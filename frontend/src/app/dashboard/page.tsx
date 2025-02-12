"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isEditing, setIsEditing] = useState(false);
  
  const router = useRouter(); 

  useEffect(() => {
    const fetchDashboard = async () => {
  
      const token = Cookies.get("token");
      console.log("dashboard token: ", token);
      if (!token) {
        router.replace("/login"); 
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/dashboard`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name, email}),
      });

      if(res.ok){
        const updatedUser = await res.json();
        setUserData(updatedUser.user);
        toast.success("Datos actualizados correctamente.", {
          position: "top-right",
          autoClose: 3000,
        });

      }else{
        const errorData = await res.json();
        toast.error(errorData.message, {
          position: "top-right",
          autoClose: 3000,
        })
        
      }
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
      alert("Error al actualizar usuario");
    }
  }

  const handleLogout = () => {
    
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
    <div className="flex flex-col items-center justify-center h-screen p-5 font-[family-name:var(--font-geist-mono)]">
      <ToastContainer />
      
      <div className="relative bg-gray-50 shadow-md p-10 rounded-lg w-[90%] max-w-[600px] min-h-[400px] flex flex-col justify-center">
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-3 right-3 rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2 text-sm hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {isEditing ? "Cerrar" : "Editar datos"}
        </button>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <h2 className="text-center">Editar Usuario</h2>
            <div>
              <label className="block text-sm">Nombre:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm">Correo electrónico:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="mt-5 rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2 text-sm hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-center">
            <h2>Datos del Usuario</h2>
            <p><strong>Id:</strong> {userData?.id}</p>
            <p><strong>Nombre:</strong> {userData?.name}</p>
            <p><strong>Correo electrónico:</strong> {userData?.email}</p>
            <p><strong>Registrado desde:</strong> {formatDate(userData?.createdAt || "")}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-5 rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2 text-sm hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
