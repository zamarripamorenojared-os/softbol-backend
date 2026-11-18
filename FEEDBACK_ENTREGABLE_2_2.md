# Retroalimentación Técnica: Entregable 2.2 (Semana 2)
**Hito:** Transacciones Atómicas ACID, Control de Concurrencia y Suite de Pruebas Automatizadas  
**Tag Evaluado:** `v0.2.0-e2.2`  
**Fecha de Publicación:** 15/11/2026, 7:12:00 p.m.  
**Estatus de Entrega:** ✅ Entrega en tiempo y forma (Sin penalización)  
**Asignatura:** Desarrollo Backend de Aplicaciones (Semestre 2026-I)  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Institución:** Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Oficial:** `DesarrolloBackend-2026-402/23124369`  
**Fecha de Evaluación:** 18 de noviembre de 2026  

---

## 1. Resumen de Evaluación Técnica Asentada en Moodle (Ítem 31372)

| Criterio de Evaluación Técnica | Ponderación | Puntaje Obtenido | Estatus Técnico |
| :--- | :---: | :---: | :---: |
| **Transacciones Atómicas ACID y Rollback en Fallos** | 40 pts | **40 / 40 pts** | ✅ Aprobado |
| **Mecanismos de Control de Concurrencia (Pesimista/Optimista)** | 30 pts | **30 / 30 pts** | ✅ Aprobado |
| **Suite de Pruebas Automatizadas y Pipeline en GitHub Actions** | 20 pts | **20 / 20 pts** | ✅ Aprobado |
| **Disciplina Git, Release Semántico y Changelog** | 10 pts | **10 / 10 pts** | ✅ Aprobado |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE (Ítem 31372)** | **100 pts** | **100 / 100 pts** | **✅ APROBADO** |

---

## 2. Diagnóstico Técnico Formativo
* **Propiedades ACID:** Verificación de ejecución atómica mediante Transaction Runners (`dataSource.transaction` o `prisma.$transaction`) garantizando aislamiento e integridad.
* **Control de Concurrencia:** Aplicación de bloqueos pesimistas (`SELECT FOR UPDATE`) en operaciones con recursos compartidos o versionado optimista (`@VersionColumn`) para prevenir condiciones de carrera.
* **Pruebas Automatizadas:** Pipeline de integración continua (CI) en GitHub Actions validando pruebas unitarias y de integración en cada push y pull request.
