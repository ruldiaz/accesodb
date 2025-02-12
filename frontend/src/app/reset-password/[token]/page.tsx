"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function ResetPassword({ params }: { params: Promise<{ token: string }> }) {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setToken(resolvedParams.token);
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Error al restablecer la contraseña.");

      toast.success("Contraseña restablecida con éxito.", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      toast.error("Error al restablecer la contraseña.", { position: "top-right", autoClose: 3000 });
    }
  };

  if (!token) return <p>Cargando...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-mono)]">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-sm font-semibold">Nueva contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 p-2 border rounded w-full"
          required
        />
        <button type="submit" className="mt-5 rounded-full border border-transparent transition-colors bg-foreground text-background px-4 py-2 text-sm hover:bg-[#383838] dark:hover:bg-[#ccc]">
          Restablecer contraseña
        </button>
      </form>
    </div>
  );
}
