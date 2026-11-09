# Retroalimentación Técnica: Entregable 1.2 (Semana 1)
**Hito:** Entidades de Negocio, Catálogos Base, Índices B-Tree y Cadena de Middlewares  
**Tag Evaluado:** `v0.1.0-e1.2`  
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
| **Modelado Relacional e Integridad de Entidades de Negocio** | 35 pts | **35 / 35 pts** | ✅ Aprobado |
| **Definición de Índices B-Tree y Claves Foráneas** | 25 pts | **25 / 25 pts** | ✅ Aprobado |
| **Catálogos Base del Dominio y Seeders Idempotentes** | 20 pts | **20 / 20 pts** | ✅ Aprobado |
| **Pipeline de Middlewares y Formato de Errores RFC 7807** | 20 pts | **20 / 20 pts** | ✅ Aprobado |
| **Subtotal Técnico** | **100 pts** | **100 pts** | — |
| **Deducción por Puntualidad / Ventana de Entrega** | — | **0 pts (Puntual)** | Estatus: `A_TIEMPO` |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE** | **100 pts** | **100 / 100 pts** | ✅ APROBADO |

---

## 2. Diagnóstico Técnico de Persistencia y Middlewares

### 2.1. Modelado de Entidades del Dominio (Cap. 6)
* **Requisitos Funcionales Asociados:** RF04 a RF06 (Entidades e integridad).
* **Entidades Clave del Negocio Modeladas:** `TorneoSoftbol`, `CategoriaSoftbol`, `EquipoSoftbol`, `RosterJugador`, `JuegoSoftbol`, `BoxScore`, `EstadisticaBateo`.
* **Buenas Prácticas de Persistencia:**
  * Uso de llaves primarias UUID v4 para prevenir vulnerabilidades de enumeración secuencial en APIs REST.
  * **Integridad Referencial:** Declaración explícita de reglas `onDelete: 'RESTRICT'` o `'CASCADE'` en relaciones padre-hijo para evitar registros huérfanos.
  * Trazabilidad temporal: Incorporación de marcas de tiempo automáticas (`@CreateDateColumn()`, `@UpdateDateColumn()`).

### 2.2. Optimización con Índices B-Tree (Cap. 6 y 14)
* **Índices Requeridos para el Dominio:** `juegos(torneo_id, fecha_juego)`, `jugadores(equipo_id, posicion)`.
* **Criterio de Desempeño:**
  * Definición explícita de anotaciones `@Index()` en columnas de filtrado frecuente, claves foráneas y campos con restricción `UNIQUE` para evitar escaneos secuenciales (*Seq Scan*) en PostgreSQL.

### 2.3. Cadena de Middlewares y Manejo de Errores RFC 7807 (Cap. 12 y 14)
* **Orden del Pipeline en Express:** Seguridad perimetral (Helmet, CORS) -> Parser JSON -> Logger -> Rutas con validación de DTOs -> Manejador centralizado de errores.
* **Estandarización de Errores (RFC 7807):** Retornar respuestas con `Content-Type: application/problem+json` conteniendo los atributos `type`, `title`, `status`, `detail` e `instance`.

---

## 3. Preparación para la Semana 2
* **Entregable 2.1 (Jueves 12 de Noviembre):** Se integrará búsqueda multicriterio avanzada, paginación estructurada (`limit`, `offset`) y capa de caché en memoria con Redis.

