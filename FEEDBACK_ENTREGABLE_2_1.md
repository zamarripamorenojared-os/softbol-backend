# Retroalimentación Técnica: Entregable 2.1 (Semana 2)
**Hito:** Paginación Avanzada, Filtros Dinámicos Multivalor y Capa de Caché con Redis  
**Tag Evaluado:** `v0.2.0-e2.1`  
**Fecha de Publicación:** 11/11/2026, 9:31:20 p.m.  
**Estatus de Entrega:** ✅ Entrega en tiempo y forma (Sin penalización)  
**Asignatura:** Desarrollo Backend de Aplicaciones (Semestre 2026-I)  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Institución:** Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Oficial:** `DesarrolloBackend-2026-402/23124369`  
**Fecha de Evaluación:** 18 de noviembre de 2026  

---

## 1. Resumen de Evaluación Técnica Asentada en Moodle (Ítem 31371)

| Criterio de Evaluación Técnica | Ponderación | Puntaje Obtenido | Estatus Técnico |
| :--- | :---: | :---: | :---: |
| **Paginación Eficiente (Offset/Cursor) y Filtros Dinámicos** | 40 pts | **40 / 40 pts** | ✅ Aprobado |
| **Aceleración en Memoria con Redis (Patrón Cache-Aside y TTL)** | 30 pts | **30 / 30 pts** | ✅ Aprobado |
| **Diseño de Índices B-Tree en PostgreSQL e Integridad** | 20 pts | **20 / 20 pts** | ✅ Aprobado |
| **Disciplina Git, Release Semántico y Changelog** | 10 pts | **10 / 10 pts** | ✅ Aprobado |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE (Ítem 31371)** | **100 pts** | **100 / 100 pts** | **✅ APROBADO** |

---

## 2. Diagnóstico Técnico Formativo
* **Paginación y Filtros:** Los endpoints de consulta deben soportar parámetros `page`, `limit`, ordenamiento multi-columna (`sortBy`, `order`) y filtrado por rangos y términos parciales (`ILIKE`).
* **Capa de Aceleración Redis:** Implementación del patrón Cache-Aside con expiración temporal (TTL adecuado) e invalidación activa ante mutaciones (`POST`, `PUT`, `DELETE`).
* **Rendimiento:** Creación de índices compuestos B-Tree en columnas de búsqueda frecuente para asegurar scans eficientes en la base de datos PostgreSQL.
