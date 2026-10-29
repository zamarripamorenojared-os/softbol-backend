# Sistema de Gestión de Softbol (SoftbolApp)
## Requisitos del Sistema

---

## 1. Descripción del Proyecto
Sistema web para la administración de torneos de softbol, facilitando el control de equipos, jugadores, programación de partidos, resultados y tabla de posiciones.

---

## 2. Requisitos Funcionales

### Módulo 1: Usuarios y Acceso
1. Registro de usuarios: Permitir que los usuarios se registren con nombre, correo electrónico y contraseña.
2. Inicio de sesión: Autenticar usuarios mediante correo y contraseña.
3. Cierre de sesión: Permitir salir del sistema de forma segura cerrando la sesión actual.
4. Roles de usuario: Manejar roles de Administrador, Representante de equipo y Jugador o Consulta.
5. Perfil de usuario: Permitir a cada usuario ver y editar su información personal y cambiar su contraseña.

### Módulo 2: Torneos y Categorías
6. Crear torneo: Permitir al administrador registrar nuevos torneos indicando nombre, fecha de inicio y fecha de fin.
7. Editar y eliminar torneos: Modificar datos o dar de baja torneos existentes.
8. Listar torneos: Mostrar el historial de torneos activos y finalizados.
9. Gestión de categorías: Crear categorías de juego como Varonil, Femenil, Mixto o Bola Puesta.
10. Estado del torneo: Cambiar el estatus del torneo entre En espera, En curso y Finalizado.

### Módulo 3: Equipos
11. Registrar equipo: Dar de alta un equipo con su nombre, color de uniforme y torneo al que pertenece.
12. Editar equipo: Modificar los datos del equipo o su información de contacto.
13. Eliminar equipo: Dar de baja a un equipo si no tiene partidos pendientes.
14. Asignar manager: Asignar a un usuario registrado como el responsable o capitán del equipo.
15. Ver perfil del equipo: Mostrar la lista de jugadores inscritos y el historial de juegos del equipo.

### Módulo 4: Jugadores
16. Registrar jugador: Agregar un jugador con nombre, fecha de nacimiento y teléfono.
17. Asignar número y posición: Registrar el número de camiseta y su posición en el campo.
18. Asignar jugador a equipo: Inscribir o vincular a un jugador dentro de la lista de un equipo.
19. Baja de jugador: Dar de baja o transferir a un jugador de un equipo.
20. Lista de jugadores: Consultar la lista completa de jugadores por equipo con sus datos básicos.

### Módulo 5: Sedes y Campos
21. Registrar campos: Dar de alta nombres y ubicaciones de los campos o estadios de juego disponibles.
22. Listar campos: Mostrar la lista de campos disponibles para la programación de partidos.

### Módulo 6: Partidos y Calendario
23. Programar partido: Crear un juego asignando equipo local, equipo visitante, campo, fecha y hora.
24. Reprogramar partido: Cambiar la fecha, hora o campo de un partido previamente agendado.
25. Cancelar o posponer partido: Marcar el estado de un partido como Pospuesto o Cancelado.
26. Consultar calendario: Permitir a cualquier usuario filtrar y ver los partidos por jornada, fecha o equipo.

### Módulo 7: Resultados y Pizarra
27. Registrar marcador final: Ingresar las carreras anotadas por el equipo local y el equipo visitante.
28. Marcar juego finalizado: Cambiar el estado del partido a Finalizado una vez guardado el resultado.
29. Registrar notas de juego: Permitir agregar observaciones básicas del partido como nocaut, forfit o entradas jugadas.

### Módulo 8: Estadísticas y Posiciones
30. Tabla de posiciones: Generar automáticamente la tabla de posiciones calculando juegos jugados, ganados, perdidos, carreras a favor, carreras en contra y diferencia de carreras.

---

## 3. Requisitos No Funcionales

1. Facilidad de uso: Interfaz clara e intuitiva para que los administradores y usuarios capturen o consulten información sin dificultad.
2. Seguridad de contraseñas: Las contraseñas deben almacenarse encriptadas mediante algoritmos seguros.
3. Control de acceso: Restringir el acceso a las funciones de administración mediante autenticación por tokens JWT.
4. Disponibilidad: El sistema debe estar disponible para que los usuarios puedan consultar el rol de juegos y resultados en cualquier momento.
5. Integridad de datos: La base de datos debe validar que no se dupliquen números de camiseta en un mismo equipo ni se empalmen juegos en el mismo campo y horario.
6. Diseño responsivo: La aplicación debe visualizarse correctamente tanto en computadoras de escritorio como en teléfonos móviles.
7. Mantenibilidad: Código modular y organizado por componentes para facilitar futuras mejoras o adiciones al sistema.
