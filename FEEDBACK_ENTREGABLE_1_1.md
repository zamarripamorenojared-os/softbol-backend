# Retroalimentación Técnica: Entregable 1.1 (Semana 1)
**Hito:** Arquitectura Limpia en TypeScript, Entorno Docker Compose y Autenticación JWT  
**Tag Evaluado:** `v0.1.0-e1.1`  
**Asignatura:** Desarrollo Backend de Aplicaciones (Semestre 2026-I)  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Institución:** Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis  
**Estudiante:** JARED ALEJANDRO ZAMARRIPA MORENO  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Oficial:** `DesarrolloBackend-2026-402/23124369`  
**Fecha de Publicación:** 11 de noviembre de 2026  

---

## 1. Resumen de Evaluación Técnica Asentada en Moodle

| Criterio de Evaluación | Ponderación | Puntaje Obtenido | Estatus Técnico |
| :--- | :---: | :---: | :---: |
| **Separación Arquitectónica en Capas (Clean Architecture / Domain-Driven)** | 35 pts | **35 / 35 pts** | ✅ Aprobado |
| **Orquestación en Contenedores (Docker Compose con PostgreSQL & Redis)** | 30 pts | **30 / 30 pts** | ✅ Aprobado |
| **Módulo de Autenticación, Hashing Bcrypt y Tokens JWT** | 25 pts | **25 / 25 pts** | ✅ Aprobado |
| **Script de Smoke Test Automatizado y Verificación de Salud** | 10 pts | **10 / 10 pts** | ✅ Aprobado |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE (Ítem 31266)** | **100 pts** | **100 / 100 pts** | **✅ APROBADO** |

---

## 2. Diagnóstico Técnico de Arquitectura y Buenas Prácticas

### 2.1. Arquitectura Limpia y Estructura Modular
* **Roles de Acceso del Dominio:** `Coordinador de Torneo`, `Anotador Oficial / Umpire`, `Manager de Equipo`, `Jugador`.
* **Observaciones:**
  * La estructura en capas (`src/domain`, `src/application`, `src/infrastructure`) debe mantener la regla de dependencia: el núcleo del dominio no debe importar frameworks ni librerías de infraestructura.
  * Inyección de dependencias para desacoplar el acceso a datos.

### 2.2. Entorno de Contenedores y Persistencia
* Verificación de `docker-compose.yml` orquestando servicios de base de datos relacional y caché Redis en red privada.
* Persistencia garantizada con volúmenes nombrados para evitar pérdida de información en reinicios.

### 2.3. Autenticación y Seguridad de Tokens JWT
* Emisión y verificación de tokens Bearer JWT con clave secreta gestionada mediante variables de entorno (`.env`).
* Contraseñas protegidas mediante algoritmos robustos (`bcrypt`) con salting adecuado.

---

## 3. Política de Regularización
* Tu calificación en este entregable es de **100 pts** (acreditado satisfactoriamente). No requiere reentrega obligatoria.
