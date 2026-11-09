# Retroalimentación Técnica: Entregable 1.1 (Semana 1)
**Hito:** Arquitectura Limpia en TypeScript, Entorno Docker Compose y Autenticación JWT  
**Tag Evaluado:** `v0.1.0-e1.1`  
**Asignatura:** Desarrollo Backend de Aplicaciones (Semestre 2026-I)  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Institución:** Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis  
**Estudiante:** JARED ALEJANDRO ZAMARRIPA MORENO  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Oficial:** `DesarrolloBackend-2026-402/23124369`  

---

## 1. Resumen de Evaluación Técnica

| Criterio de Evaluación | Ponderación | Puntaje Obtenido | Estatus Técnico |
| :--- | :---: | :---: | :---: |
| **Separación Arquitectónica en Capas (Clean Architecture)** | 25 pts | **25 / 25 pts** | ✅ Aprobado |
| **Orquestación en Contenedores (Docker Compose & DB/Redis)** | 25 pts | **25 / 25 pts** | ✅ Aprobado |
| **Módulo de Autenticación, Hashing Bcrypt y Tokens JWT** | 30 pts | **30 / 30 pts** | ✅ Aprobado |
| **Tipado Estricto TypeScript & Calidad de Código** | 20 pts | **20 / 20 pts** | ✅ Aprobado |
| **Subtotal Técnico** | **100 pts** | **100 pts** | — |
| **Deducción por Puntualidad / Ventana de Entrega** | — | **0 pts (Puntual)** | Estatus: `A_TIEMPO` |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE** | **100 pts** | **100 / 100 pts** | ✅ APROBADO |

---

## 2. Diagnóstico Técnico de Arquitectura y Buenas Prácticas

### 2.1. Arquitectura Limpia y Estructura Modular (Cap. 13)
* **Requisitos Funcionales Asociados:** RF01 a RF03 (Autenticación y usuarios).
* **Roles de Acceso Implementados:** `Coordinador de Torneo`, `Anotador Oficial / Umpire`, `Manager de Equipo`, `Jugador`.
* **Observaciones de Diseño:**
  * La separación en capas debe mantener desacoplada la lógica del dominio de los frameworks web. Los controladores deben limitarse a orquestar peticiones/respuestas HTTP y delegar la lógica de negocio a los servicios de aplicación.
  * **Inversión de Dependencias (DIP):** Las dependencias de infraestructura (como repositorios TypeORM o clientes Redis) deben inyectarse a través de interfaces para facilitar pruebas unitarias aisladas.

### 2.2. Entorno de Contenedores y Persistencia (Cap. 10)
* **Aciertos:** Se valida la configuración de `docker-compose.yml` con PostgreSQL 16 y Redis 7 Alpine sobre red privada.
* **Buenas Prácticas:**
  * Uso de volúmenes persistentes con nombre (`postgres_data`) para salvaguardar los registros ante reinicios.
  * Se recomienda agregar verificaciones de salud (*healthchecks*) en la base de datos para garantizar que el backend no inicie hasta que PostgreSQL esté aceptando conexiones.

### 2.3. Autenticación, Hashing Bcrypt y Manejo de JWT (Cap. 5)
* **Hashing de Contraseñas:** Se constata el uso de algoritmos de derivación de claves (`bcrypt`) con factor de costo $\ge 10$. Las contraseñas jamás deben almacenarse en texto plano.
* **Seguridad de Tokens JWT:**
  * Exclusión estricta del campo `password` en las respuestas JSON de login y registro.
  * La clave secreta (`JWT_SECRET`) debe gestionarse exclusivamente a través de variables de entorno (`.env`). Evitar cualquier valor por defecto (*fallback*) en el código fuente.

### 2.4. Calidad de Código en TypeScript (Cap. 3 y 4)
* Mantener habilitado `strict: true` en `tsconfig.json`.
* Evitar aserciones con `any` al extender objetos de Express (`req.user`); declarar la extensión de tipos en un archivo `src/@types/express.d.ts`.

---

## 3. Política de Reentrega y Mejora de Nota (Tags `-rev`)
* Tu calificación en este entregable es de **100 pts** (aprobatoria). No es obligatorio reenviar, salvo que desees subsanar las observaciones técnicas señaladas.
* **Tope reglamentario de reentrega:** 85 pts (o 70 pts para proyectos con regularización tardía de requerimientos).
