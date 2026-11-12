# Reporte de Evaluación Técnica y Retroalimentación: Semana 1
**Asignatura:** Desarrollo Backend de Aplicaciones · Semestre 2026-I  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  
**Proyecto Asignado:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio Institucional:** `DesarrolloBackend-2026-402/23124369`  
**Estudiante:** JARED ALEJANDRO ZAMARRIPA MORENO  
**Fecha de Auditoría:** 11 de noviembre de 2026  

---

## 📊 1. Resumen de Calificaciones Obtenidas (Semana 1)

| Hito / Entregable | Tag Git | Estatus de Entrega | Calificación Obtenida | Estado Académico |
| :--- | :---: | :---: | :---: | :---: |
| **Entregable 1.1: Arquitectura Limpia, Docker y JWT** | `v0.1.0-e1.1` | A_TIEMPO | **100 / 100** | ✅ Acreditado |
| **Entregable 1.2: Entidades de Negocio e Índices B-Tree** | `v0.1.0-e1.2` | A_TIEMPO | **45 / 100** | ❌ No Acreditado |
| **Promedio Global Ponderado Semana 1** | — | — | **72.5 / 100** | ✅ Aprobatorio |

> **Nota de Sincronización:** Estas calificaciones coinciden al 100% con los ítems de calificación registrados en la plataforma Moodle (Ítem 31266 para E1.1 e Ítem 31267 para E1.2).

---

## 🔍 2. Desglose Técnico Justificado de la Calificación

### Entregable 1.1 (`v0.1.0-e1.1`): Calificación: **100 / 100**
* **Separación de Capas:** Estructura modular limpia implementada (+35 pts).
* **Infraestructura Contenedores:** Docker Compose con PostgreSQL y Redis configurado (+30 pts).
* **Autenticación JWT:** Módulo de autenticación con hash y JWT verificado (+25 pts).
* **Smoke Testing:** Script de smoke test presente (+10 pts).

### Entregable 1.2 (`v0.1.0-e1.2`): Calificación: **45 / 100**
* **Cobertura de Entidades del Dominio:** 0 de 7 entidades implementadas (0% de cobertura).
  * **Entidades Implementadas:** *Ninguna*
  * **Entidades Faltantes:** `TorneoSoftbol`, `CategoriaSoftbol`, `EquipoSoftbol`, `RosterJugador`, `JuegoSoftbol`, `BoxScore`, `EstadisticaBateo`
* **Controladores y Rutas de Negocio:** 50 rutas/controladores implementados.
* **Pruebas Automatizadas y CI/CD:** GitHub Actions en estado `NO_RUNS`.
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
> **Calificación máxima de reentrega:** **85 / 100** (o 70 pts si tuvo regularización tardía de requerimientos).

---
*Generado automáticamente por el Sistema de Evaluación y Auditoría Técnica Continua (Antigravity · UAS).*
