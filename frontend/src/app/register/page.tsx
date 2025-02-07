"use client"; // Para el App Router, omite en el Pages Router
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter para redirección

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter(); // Instancia de useRouter

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error en el registro");

      alert("Usuario registrado con éxito");
      router.push("/login"); // ✅ Redirigir al login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Registro</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
