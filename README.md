# API REST de Gestión y Prioridad de Postulaciones Laborales

API REST en Node.js y MySQL para gestionar postulaciones a vacantes laborales y ordenar las revisiones según la afinidad del perfil del candidato.

## Requisitos Previos

- Node.js (v18+)
- MySQL Server (v8.0+)

## Instalación y Configuración

**Clonar el repositorio e instalar dependencias:**
```bash
   npm install
```
**Configurar la Base de Datos:**
Crear la base de datos ejecutando el script database.sql en tu servidor MySQL.

```bash
    mysql -u root -p < database.sql
```
**Configurar variables de entorno:**
Copiar el archivo .env.example a .env y actualizar los accesos de la base de datos:
```bash
    cp .env.example .env
```
**Ejecutar la aplicación:**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```
**Ejecutar las Pruebas Automatizadas:**
```bash
   npm test
```

# Documentación de Endpoints
**Regitrar postulación**
Endpoint: POST /applications

Body:
```bash
{
  "candidateId": 1,
  "vacancyId": 1,
  "source": "REFERRAL",
  "coverLetter": "I have experience with Node.js, SQL and REST APIs"
}
```
Respuesta (201 Created):
```
{
  "message": "Postulación registrada exitosamente",
  "data": {
    "id": 1,
    "candidate_id": 1,
    "vacancy_id": 1,
    "source": "REFERRAL",
    "score": 9,
    "priority": "TOP",
    "status": "RECEIVED"
  }
}
```
***Consultar Postulaciones***
Endpoint: GET /applications

Parámetros Query (Opcionales): status, vacancyId

Ejemplo: GET /applications?status=RECEIVED&vacancyId=1

Respuesta (200 OK):
```bash
{
  "data": [
    {
      "id": 1,
      "candidateName": "Jennifer López",
      "candidateEmail": "jennifer.lopez@example.com",
      "vacancyTitle": "Backend Developer Node.js Junior",
      "score": 9,
      "priority": "TOP",
      "status": "RECEIVED"
    }
  ]
}
```
# Actualizar Estado de Postulación
Endpoint: PUT /applications/:id/status

Body:
```bash
{
  "status": "IN_REVIEW"
}
```
Respuesta (200 OK):
```
{
  "message": "Estado de postulación actualizado",
  "data": {
    "id": 1,
    "status": "IN_REVIEW"
  }
}
```