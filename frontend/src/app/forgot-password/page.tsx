"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("No se pudo enviar el correo.");

      toast.success("Correo de recuperación enviado.", {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (err) {
      toast.error("Error al enviar el correo.", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)]">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-sm font-semibold">Recuperar contraseña</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 p-2 border rounded w-full text-sm"
          required
        />
        <button type="submit" className="mt-5 rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2 text-sm hover:bg-[#383838] dark:hover:bg-[#ccc]">
          Enviar correo de recuperación
        </button>
      </form>
    </div>
  );
}
