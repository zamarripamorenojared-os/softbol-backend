# Reporte de Evaluación Técnica y Retroalimentación: Semana 1
**Asignatura:** Desarrollo Backend de Aplicaciones · Semestre 2026-I  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Institucional:** `DesarrolloBackend-2026-402/23124369`  
**Fecha de Auditoría:** 11 de noviembre de 2026  

---

## 📊 1. Resumen de Calificaciones Obtenidas (Semana 1)

| Hito / Entregable | Tag Git | Estatus de Entrega | Calificación Obtenida | Estado Académico |
| :--- | :---: | :---: | :---: | :---: |
| **Entregable 1.1: Arquitectura Limpia, Docker y JWT** | `v0.1.0-e1.1` | A_TIEMPO | **100 / 100** | ✅ Acreditado |
| **Entregable 1.2: Entidades de Negocio e Índices B-Tree** | `v0.1.0-e1.2` | A_TIEMPO | **45 / 100** | ⚠️ Requiere Regularización |
| **PROMEDIO GLOBAL SEMANA 1** | — | — | **72.5 / 100** | ✅ APROBADO |

---

## 🔍 2. Desglose Técnico Justificado de la Calificación

### Entregable 1.1 (`v0.1.0-e1.1`): Calificación: **100 / 100**
* **Arquitectura Limpia y TypeScript (+35 pts):** ✅ Estructura en capas implementada correctamente (`domain`, `application`, `infrastructure`).
* **Orquestación Docker Compose (+30 pts):** ✅ Archivo `docker-compose.yml` verificado con servicios PostgreSQL 16 y Redis 7.
* **Seguridad y Autenticación JWT / Bcrypt (+25 pts):** ✅ Hashing seguro y verificación de tokens JWT implementada.
* **Suite de Pruebas de Humo (+10 pts):** ✅ Script de smoke test (`scripts/smoke_test.js`) presente.

### Entregable 1.2 (`v0.1.0-e1.2`): Calificación: **45 / 100**
* **Modelado de Entidades Relacionales (+50 pts max):**
  * **Requeridas por especificación:** **7** entidades.
  * **Implementadas en el código:** **0** entidades (0% de cobertura).
  * **Puntaje obtenido:** **0 / 50 pts**.
  * **Entidades del proyecto encontradas:**
  - *Ninguna entidad del proyecto implementada (solo plantilla inicial).*
  * **Entidades faltantes por implementar:**
  - `TorneoSoftbol`
  - `CategoriaSoftbol`
  - `EquipoSoftbol`
  - `RosterJugador`
  - `JuegoSoftbol`
  - `BoxScore`
  - `EstadisticaBateo`
* **Controladores y Rutas de Dominio Propio (+25 pts):** ✅ 50 controladores específicos implementados (+25 pts).
* **Smoke Tests Escalonados (+15 pts):** ✅ Pruebas adaptadas al modelo de datos del proyecto (+15 pts).
* **Integración Continua GitHub Actions (+10 pts):** ⚪ Sin ejecuciones registradas (+5 pts si tiene tests locales).

---

## 📢 3. Observaciones de la Auditoría Técnica
* El estudiante recibió 100 en el Entregable 1.2 pero implementó 0 de 7 entidades requeridas. Solo tiene los archivos de la plantilla inicial.


> [!IMPORTANT]
> **VENTANA EXTRAORDINARIA DE SEGUNDA OPORTUNIDAD (TAG `-rev`):**
> Dispone de **48 horas** (fecha límite: **Viernes 13 de noviembre de 2026, 23:59 hrs Sinaloa / UTC-7**) para regularizar su entrega:
> 1. Implemente las entidades faltantes en `prisma/schema.prisma` o `src/domain/entities/`.
> 2. Asegúrese de que sus pruebas automatizadas y el pipeline de GitHub Actions pasen en verde.
> 3. Suba la etiqueta de reentrega a GitHub:
>    ```bash
>    git tag -a v0.1.1-e1.2-rev -m "fix(e1.2-rev): regularizacion de entidades faltantes y pruebas"
>    git push origin v0.1.1-e1.2-rev
>    ```
> **Calificación máxima de reentrega:** **85 / 100**.

---
*Informe generado automáticamente por el Sistema de Autograding y Auditoría Bimodal Institucional · UAS Facultad de Ingeniería Mochis.*
