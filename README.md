# **AccesoDB - Aplicación de Autenticación**  

Aplicación para autenticación de usuarios mediante correo y contraseña, utilizando **Next.js**, **Express**, y **PostgreSQL**.  

## 🚀 **Tecnologías utilizadas**  
- **Frontend:** Next.js  
- **Backend:** Express.js  
- **Base de Datos:** PostgreSQL (Neon Tech)  
- **Autenticación:** JWT + Cookies  
- **Despliegue:** Vercel (Frontend) y Render (Backend)  
- **Gestión de dependencias:** npm  
- **Contenedores:** Docker   

---

## 📂 **Repositorios y despliegues**  

- **Repositorio en GitHub:** [🔗 AccesoDB](https://github.com/ruldiaz/accesodb)  
- **Frontend en Vercel:** [🔗 accesodbfrontend.vercel.app](https://accesodbfrontend.vercel.app/)  
- **Backend en Render:** [🔗 accesodb.onrender.com](https://accesodb.onrender.com)  
- **Base de datos en Neon Tech:** [🔗 Neon Console](https://console.neon.tech/)  

---

## ⚙️ **Instalación y configuración**  

### 1️⃣ **Clonar el repositorio**  
```bash
git clone https://github.com/ruldiaz/accesodb.git
cd accesodb
```

### 2️⃣**Instalar dependencias** 
Ejecutar en las carpetas backend y frontend:
```bash
npm install
```

### 3️⃣ **Configurar variables de entorno**
Crear un archivo .env en backend y otro en frontend con las variables de configuración necesarias:

Ejemplo para el backend (.env)
```bash
PORT=5000
JWT_SECRET=tu_clave_secreta
DATABASE_URL=postgresql://usuario:password@host:puerto/basededatos
```

Ejemplo para el frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://accesodb.onrender.com
```

## **Ejecutar la aplicación en local**
Frontend (Next.js)
Ejecutar en la carpeta frontend:
```bash
npm run dev
```
La aplicación se ejecutará en: [http://localhost:3000]


## **Backend (Express.js)**
Ejecutar en la carpeta backend:
```bash
npm start
```
El servidor se ejecutará en: [http://localhost:5000]

## **Ejecutar con Docker**
Para ejecutar la aplicación con Docker:

- Configurar las variables de entorno en los archivos .env correspondientes.
- Construir y levantar los contenedores.
```bash
docker-compose up --build
```

- Acceder a la aplicación en el navegador

## **Endpoints del Backend**
Autenticación
POST	/api/users/register	Registra un nuevo usuario
POST	/api/users/login	Inicia sesión
GET   /api/users/dashboard Interfaz de usuario
