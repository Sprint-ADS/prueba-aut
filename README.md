# Auth Service

Este servicio de autenticación está construido con NestJS y proporciona funcionalidades de registro e inicio de sesión para usuarios. Está diseñado para ser desplegado en Google Cloud Run con una base de datos PostgreSQL en Cloud SQL.

## Características

- Registro de usuarios
- Inicio de sesión con JWT
- Validación de datos
- Hasheo de contraseñas
- Roles de usuario (admin, user)
- Preparado para despliegue en Cloud Run

## Estructura de la base de datos

La tabla `usuarios` contiene los siguientes campos:
- id (UUID, generado automáticamente)
- nombre
- apellidos
- correo (único)
- telefono
- contraseña (hasheada)
- rol (enum: 'admin', 'user', por defecto 'user')
- fecha_creacion (timestamp, generado automáticamente)

## Configuración

### Variables de entorno

Crea un archivo `.env` basado en `.env.example` con las siguientes variables:

```
# Database Configuration
DB_HOST=your-cloud-sql-instance-ip
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=your-database
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en modo producción
npm run start:prod
```

## Despliegue en Cloud Run

### Preparación

1. Asegúrate de tener configurado Google Cloud SDK y Docker en tu máquina local.
2. Crea una instancia de Cloud SQL con PostgreSQL.
3. Crea la base de datos y las tablas necesarias.

### Construir y desplegar manualmente

```bash
# Construir la imagen Docker
docker build -t gcr.io/[PROJECT_ID]/auth-service .

# Subir la imagen a Artifact Registry
docker push gcr.io/[PROJECT_ID]/auth-service

# Desplegar en Cloud Run
gcloud run deploy auth-service \
  --image gcr.io/[PROJECT_ID]/auth-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DB_HOST=[DB_HOST],DB_PORT=5432,DB_USERNAME=[DB_USERNAME],DB_PASSWORD=[DB_PASSWORD],DB_DATABASE=[DB_DATABASE],DB_SSL=true,JWT_SECRET=[JWT_SECRET],NODE_ENV=production
```

### Despliegue automatizado con Cloud Build

Puedes utilizar el archivo `cloudbuild.yaml` incluido para configurar un despliegue automatizado con Cloud Build.

## Endpoints API

### Registro de usuario
```
POST /auth/register
Body: {
  "nombre": "string",
  "apellidos": "string",
  "correo": "string",
  "telefono": "string",
  "contraseña": "string"
}
```

### Inicio de sesión
```
POST /auth/login
Body: {
  "correo": "string",
  "contraseña": "string"
}
```

## Seguridad

- Las contraseñas se almacenan hasheadas usando bcrypt
- La autenticación se realiza mediante JWT
- Se implementa validación de datos con class-validator
- Se incluyen guards para proteger rutas basadas en roles