# Reporte de Evaluación y Retroalimentación: Semana 1
**Proyecto:** SoftbolApp – Gestión de Ligas de Softbol  
**Repositorio:** `DesarrolloBackend-2026-402/23124369`  
**Docente:** Dr. Herman Geovany Ayala Zúñiga · Semestre 2026-I  

---

## 1. Resumen de Calificaciones de la Semana 1

| Hito / Entregable | Tag de Release | Estatus de Puntualidad | Calificación | Estado |
| :--- | :---: | :---: | :---: | :---: |
| **Entregable 1.1: Arquitectura y JWT** | `v0.1.0-e1.1` | A_TIEMPO | **100 / 100** | ✅ Aprobado |
| **Entregable 1.2: Entidades e Índices B-Tree** | `v0.1.0-e1.2` | A_TIEMPO | **100 / 100** | ✅ Aprobado |
| **Promedio Global Semana 1** | — | — | **100 / 100** | ✅ APROBADO |

---

## 2. Diagnóstico Técnico Formativo

### Entregable 1.1 (`v0.1.0-e1.1`)
* Entregable e1.1 evaluado. Tag: v0.1.0-e1.1. Estatus: A_TIEMPO. Calificación final: 100/100.
* **Arquitectura Limpia:** Separación en capas (controladores, servicios, dominio, repositorios).
* **Contenedores:** `docker-compose.yml` con PostgreSQL 16 y Redis 7 alpine.
* **Seguridad:** Autenticación JWT y hashing Bcrypt con costo >= 10.

### Entregable 1.2 (`v0.1.0-e1.2`)
* Entregable e1.2 evaluado. Tag: v0.1.0-e1.2. Estatus: A_TIEMPO. Calificación final: 100/100.
* **Entidades:** Modelado relacional en base de datos con integridad referencial.
* **Índices:** Índices B-Tree en columnas de filtrado frecuente.
* **Middlewares:** Validación de esquemas DTOs (códigos 400/422).

---

## 3. Política de Segunda Oportunidad (Tags `-rev`)
Si su calificación en cualquiera de los dos entregables es menor a **80 puntos**, dispone de una ventana de **48 horas** para subsanar observaciones técnicas y publicar una etiqueta con sufijo `-rev` (ejemplo: `v0.1.1-e1.1-rev` o `v0.1.1-e1.2-rev`).
* **Tope máximo de reentrega:** 85 puntos (o 70 puntos si el proyecto tiene regularización tardía de requerimientos).
