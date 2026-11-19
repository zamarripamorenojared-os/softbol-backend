# Guía de Ejecución: Nuevos Arneses de Prueba Deterministas y Ofensivos (Semanas 1 y 2)

**Asignatura:** Desarrollo Backend de Aplicaciones · Semestre 2026-I  
**Universidad Autónoma de Sinaloa · Facultad de Ingeniería Mochis**  
**Profesor Titular:** Dr. Herman Geovany Ayala Zúñiga  

---

## 🎯 ¿Por qué se actualizaron las pruebas?

Durante la auditoría técnica de las Semanas 1 y 2, se detectó que los scripts de prueba previos (`smoke_test.js`) eran excesivamente tolerantes: permitían códigos de error (`[200, 400, 401, 403]`) y las pruebas `k6` se ejecutaban sin token de autenticación (aprobando con latencias artificiales de 2 ms porque el middleware rechazaba la petición de inmediato).

Para garantizar un estándar de ingeniería backend acorde a la industria, se han diseñado **dos suites de pruebas deterministas**:
1. `scripts/test_strict_s1.js` (Entregables 1.1 y 1.2: Clean Architecture, Docker Compose, JWT, DTOs y Entidades).
2. `scripts/test_strict_s2.js` (Entregables 2.1 y 2.2: Paginación, Transacciones ACID, Redis Caché, Rate Limiting y k6 autenticado).

---

## 🚀 Cómo ejecutar las pruebas en tu entorno local

### 1. Levanta tus contenedores de base de datos y Redis
```bash
docker compose up -d
```

### 2. Inicia tu servidor backend
```bash
npm run dev
# Asegúrate de que el servidor esté escuchando en http://localhost:3000
```

### 3. Ejecuta la Suite Estricta de la Semana 1
```bash
node scripts/test_strict_s1.js
```
*Si obtienes $\ge 80$ puntos, tu entrega de la Semana 1 queda acreditada en nivel Excelente.*

### 4. Ejecuta la Suite Estricta de la Semana 2
```bash
node scripts/test_strict_s2.js
```
*Si obtienes $\ge 80$ puntos, tu entrega de la Semana 2 queda acreditada en nivel Excelente.*

---

## 🛡️ Criterios de Acreditación Rigurosa

| Bloque | Entregable | Criterio Estricto Evaluado | Puntaje |
| :--- | :--- | :--- | :---: |
| **S1** | **E1.1** | Healthcheck 200 OK con JSON `{ status: "ok" }` | 10 pts |
| **S1** | **E1.1** | `docker-compose.yml` con servicios App + DB + Volúmenes | 15 pts |
| **S1** | **E1.1** | Arquitectura Limpia en capas (Domain, Application, Infra) | 15 pts |
| **S1** | **E1.1** | Hashing seguro de contraseñas (`bcrypt` o `argon2`) | 10 pts |
| **S1** | **E1.2** | Petición sin token rechazada con **401 Unauthorized** exacto | 15 pts |
| **S1** | **E1.2** | Token corrupto/falso rechazado con **401 Unauthorized** exacto | 10 pts |
| **S1** | **E1.2** | Payload incompleto rechazado con **400 o 422** estructurado RFC 7807 | 15 pts |
| **S1** | **E1.2** | Entidades relacionales ORM con PK, FK y campos auditables | 10 pts |
| **S2** | **E2.1** | Paginación `{ data: [], pagination: { page, limit, total } }` | 15 pts |
| **S2** | **E2.1** | Transacciones atómicas en código (`$transaction`, `queryRunner`) | 15 pts |
| **S2** | **E2.1** | Resiliencia ante ráfagas concurrentes (sin crasheos 500) | 20 pts |
| **S2** | **E2.2** | Cliente Redis y operaciones de caché `get`/`set` | 15 pts |
| **S2** | **E2.2** | Protección de Rate Limiting con respuesta HTTP 429 | 15 pts |
| **S2** | **E2.2** | Script `k6_load_test.js` con token JWT en `setup()` | 20 pts |

---

## ⏰ Ventana de Regularización y Reintento (Sin Penalización)

* **Cierre de Ventana:** **Domingo 22 de Noviembre de 2026 a las 23:59 hrs**.
* **Cómo entregar la corrección:**
  1. Corrige tu código para pasar ambos tests.
  2. Haz commit de tus cambios:
     ```bash
     git add .
     git commit -m "fix(backend): corrección y blindaje con suite estricta s1 y s2"
     git push origin main
     ```
  3. (Opcional recomendado) Genera los tags de reintento:
     ```bash
     git tag v0.1.0-e1.1-fix
     git tag v0.2.0-e2.2-fix
     git push origin --tags
     ```
  4. El autograder reevaluará tu repositorio y tu calificación en Moodle se actualizará automáticamente hasta los **100 puntos**.

