# Respuestas de Evaluación Técnica y Decisiones de Arquitectura

### 1. ¿Cómo se aplicaron las buenas prácticas en la estructura del proyecto?
Se implementó la arquitectura en capas (**Controller - Service - Repository**) separando la gestión de rutas HTTP, la lógica de negocio pura y la persistencia de datos en SQL. Se aplicaron variables de entorno mediante `dotenv` para evitar la exposición de credenciales sensibles, y se centralizó el manejo de excepciones HTTP con un middleware especializado.

### 2. ¿Cómo se garantiza la integridad de datos en el cálculo de prioridades y regla de duplicidad?
El backend calcula automáticamente el puntaje y nivel de prioridad previo a la inserción en la base de datos sin confiar en los parámetros del cliente. Además, la regla de duplicidad verifica el estado actual y fecha de actualización en la base de datos para impedir que un candidato tenga postulaciones simultáneas activas o re-postulaciones antes del periodo ventana de 30 días.

### 3. ¿Cómo se gestionan las consultas de ordenamiento y filtrado de postulaciones?
La consulta a la base de datos utiliza la cláusula `ORDER BY a.score DESC, a.created_at ASC` para priorizar los puntajes altos y desempatar cronológicamente. Además, permite aplicar filtros opcionales dinámicos por `status` y `vacancy_id` utilizando sentencias preparadas en `mysql2` para precaver inyecciones SQL.