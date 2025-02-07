"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 className="text-sm text-center font-[family-name:var(--font-geist-mono)]">Ingresa los datos de acceso de tu cuenta</h2>
      <form className="text-sm font-[family-name:var(--font-geist-mono)]" onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold" type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      
      {/* Register page */}
      <p className="text-sm text-center font-[family-name:var(--font-geist-mono)]">
        ¿Aun no tienes cuenta?{" "}
        <Link href="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Crea una cuenta gratis!
        </Link>
      </p>
    </div>
  );
}
