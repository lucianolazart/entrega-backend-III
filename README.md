# Proyecto Backend III - Sistema de Adopción de Mascotas

Este proyecto es una API REST para gestionar adopciones de mascotas, desarrollado con Node.js, Express, MongoDB y Mongoose.

**Enlace a la imagen de docker:** https://hub.docker.com/r/lucianolazart/adoptme-backend

## Características

- **API RESTful** para gestión de usuarios, mascotas y adopciones
- **Documentación con Swagger**: Acceso completo a la documentación de la API en `/api-docs`
- **Autenticación JWT**: Sistema de login y registro de usuarios
- **Winston Logger**: Sistema de logging robusto
- **Tests funcionales**: Tests con Mocha y Supertest
- **Dockerizado**: Imagen Docker lista para producción

## Tecnologías Utilizadas

- Node.js 20.11.0
- Express 4.18.2
- MongoDB (MongoDB Atlas)
- Mongoose 6.7.5
- Swagger/OpenAPI 3.0
- Winston 3.17.0
- Mocha y Chai (testing)
- Supertest (testing de endpoints)
- Docker

## Instalación y Configuración

### Requisitos Previos

- Node.js 20.11.0 o superior
- MongoDB (local o MongoDB Atlas)
- Docker (opcional)

### Instalación Local

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd entrega-backend-III
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

## Configuración de Base de Datos

La aplicación utiliza MongoDB Atlas. La conexión está configurada en `src/app.js`.

## Dockerización

### Construir la Imagen Docker

```bash
docker build -t adoptme-backend .
```

### Ejecutar el Contenedor

```bash
docker run -p 8080:8080 adoptme-backend
```

### Docker Hub

La imagen está disponible en Docker Hub:

```bash
docker pull lucianolazart/adoptme-backend:latest
docker run -p 8080:8080 lucianolazart/adoptme-backend:latest
```

**Enlace a la imagen:** https://hub.docker.com/r/lucianolazart/adoptme-backend

## Pruebas

### Ejecutar Tests Funcionales

Para ejecutar todos los tests:
```bash
npm test
```

### Tests de Adopción

Los tests funcionales están en `test/adoption.test.js` y cubren:
- GET /api/adoptions - Obtener todas las adopciones
- GET /api/adoptions/:aid - Obtener una adopción específica
- POST /api/adoptions/:uid/:pid - Crear una nueva adopción

Cada test verifica:
- Respuestas de éxito (200)
- Manejo de errores (400, 404)
- Validación de datos

## Documentación con Swagger

Una vez iniciado el servidor, accede a la documentación en:

```
http://localhost:8080/api-docs
```

### Endpoints Documentados

#### Módulo de Users
- **GET** `/api/users` - Obtener todos los usuarios
- **GET** `/api/users/:uid` - Obtener un usuario por ID
- **PUT** `/api/users/:uid` - Actualizar un usuario
- **DELETE** `/api/users/:uid` - Eliminar un usuario

#### Módulo de Pets
- **GET** `/api/pets` - Obtener todas las mascotas
- **POST** `/api/pets` - Crear una mascota
- **POST** `/api/pets/withimage` - Crear una mascota con imagen
- **PUT** `/api/pets/:pid` - Actualizar una mascota
- **DELETE** `/api/pets/:pid` - Eliminar una mascota

#### Módulo de Adoptions
- **GET** `/api/adoptions` - Obtener todas las adopciones
- **GET** `/api/adoptions/:aid` - Obtener una adopción por ID
- **POST** `/api/adoptions/:uid/:pid` - Crear una adopción

#### Módulo de Sessions
- **POST** `/api/sessions/register` - Registrar un nuevo usuario
- **POST** `/api/sessions/login` - Iniciar sesión
- **GET** `/api/sessions/current` - Obtener usuario actual

## Logging con Winston

El proyecto utiliza Winston para logging:

- **Nivel de producción**: Solo errores
- **Nivel de desarrollo**: Info y superiores
- **Logs en archivo**: `src/logs/error.log`
- **Logs en consola**: Formateado con colores

## Mocks y Datos de Prueba

El proyecto incluye un módulo de mocks en `/api/mocks` para generar datos de prueba con Faker.js.

## Control de Errores

Todos los controladores implementan manejo de errores con try-catch y logging con Winston. Los errores se retornan con códigos HTTP apropiados:

- **200**: Éxito
- **400**: Error de cliente (datos inválidos)
- **404**: No encontrado
- **500**: Error del servidor