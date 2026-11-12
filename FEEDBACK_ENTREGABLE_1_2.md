# Retroalimentación Técnica: Entregable 1.2 (Semana 1)
**Hito:** Entidades de Negocio, Catálogos Base, Índices B-Tree y Cadena de Middlewares  
**Tag Evaluado:** `v0.1.0-e1.2`  
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
| **Modelado e Integridad de Entidades del Dominio** | 50 pts | **0 / 50 pts** | Cobertura: 0/7 (0%) |
| **Controladores y Rutas de Negocio** | 25 pts | **25 / 25 pts** | 50 rutas/controladores implementados |
| **Smoke Tests Personalizados para el Dominio** | 15 pts | **15 / 15 pts** | ✅ Personalizado |
| **Pipeline CI/CD en GitHub Actions** | 10 pts | **5 / 10 pts** | Estado CI: `NO_RUNS` |
| **CALIFICACIÓN FINAL ASENTADA EN MOODLE (Ítem 31267)** | **100 pts** | **45 / 100 pts** | **❌ NO APROBADO** |

---

## 2. Detalle de Entidades Requeridas vs Implementadas

* **Entidades Requeridas del Proyecto (7):** `TorneoSoftbol`, `CategoriaSoftbol`, `EquipoSoftbol`, `RosterJugador`, `JuegoSoftbol`, `BoxScore`, `EstadisticaBateo`
* **Entidades Implementadas con Éxito (0):** *Ninguna entidad del proyecto implementada (solo plantilla inicial).*
* **Entidades Faltantes (7):** `TorneoSoftbol`, `CategoriaSoftbol`, `EquipoSoftbol`, `RosterJugador`, `JuegoSoftbol`, `BoxScore`, `EstadisticaBateo`
* **Dictamen de Auditoría:** El estudiante recibió 100 en el Entregable 1.2 pero implementó 0 de 7 entidades requeridas. Solo tiene los archivos de la plantilla inicial.


> [!IMPORTANT]
> **VENTANA EXTRAORDINARIA DE SEGUNDA OPORTUNIDAD (TAG `v0.1.1-e1.2-rev`):**
> Dispones de **48 horas** (fecha límite: **Viernes 13 de noviembre de 2026, 23:59 hrs Sinaloa / UTC-7**) para regularizar tu entrega:
> 1. Implementa las entidades faltantes (`TorneoSoftbol`, `CategoriaSoftbol`, `EquipoSoftbol`, `RosterJugador`, `JuegoSoftbol`, `BoxScore`, `EstadisticaBateo`) en `prisma/schema.prisma` o `src/domain/entities/`.
> 2. Asegúrate de que las pruebas automatizadas y el pipeline de CI en GitHub Actions pasen en verde.
> 3. Genera y publica la etiqueta de reentrega:
>    ```bash
>    git tag -a v0.1.1-e1.2-rev -m "fix(e1.2-rev): regularizacion de entidades faltantes y pruebas"
>    git push origin v0.1.1-e1.2-rev
>    ```
> **Calificación máxima de reentrega:** **85 / 100** (o 70 si el proyecto tuvo penalización de requerimientos).

