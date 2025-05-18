# Ripple Backend

[![Calidad de Código y Seguridad](https://github.com/xErik444x/ripple_backend/actions/workflows/code-check.yml/badge.svg)](https://github.com/xErik444x/ripple_backend/actions/workflows/code-check.yml)

## ¿Qué es Ripple Backend?

Ripple Backend es una API construida con NestJS que da soporte a un bot de Discord con funcionalidades como gestión de cumpleaños, integración con OpenAI y ejecución de comandos desde una API REST. Es robusta, escalable y pensada para facilitar la integración con servicios de Discord.

## Características principales

- **Comandos de Discord por API**: ejecutá comandos del bot desde tu app vía HTTP.
- **Cumpleaños**: creá, editá o eliminá cumpleaños de usuarios de Discord.
- **OpenAI**: respuestas automáticas generadas por IA, configurables por servidor.
- **Salud del servicio**: un endpoint para monitorear que todo esté funcionando.

## Documentación de la API (Swagger)

### Discord

- `POST /discord/command` - Ejecuta comandos del bot
- `GET /discord/health` - Chequea el estado del backend

### Cumpleaños

- `POST /birthdays` - Crear un cumpleaños nuevo
- `GET /birthdays` - Listar todos los cumpleaños (paginado)
- `GET /birthdays/upcoming` - Cumpleaños próximos por servidor
- `GET /birthdays/today` - Cumpleaños de hoy por servidor
- `GET /birthdays/{userId}` - Obtener el cumpleaños de un usuario
- `PATCH /birthdays/{userId}` - Actualizar un cumpleaños
- `DELETE /birthdays/{userId}` - Eliminar un cumpleaños

### OpenAI

- `POST /openai/generate` - Genera una respuesta de IA
- `GET /openai/config/{guildId}` - Obtiene la config de IA de un servidor
- `PATCH /openai/config/{guildId}` - Edita la configuración de IA del servidor

## Seguridad

Todos los endpoints requieren autenticación mediante una API key. Debés incluirla en los headers de cada solicitud.

## Instalación

```bash
# Cloná el repo
git clone https://github.com/xErik444x/ripple_backend.git

# Entrá al proyecto
cd ripple_backend

# Instalá las dependencias
npm install
```

## Configuración

Creá un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=3000
DATABASE_URL=tu_conexion_a_la_base_de_datos
API_KEY=tu_api_key
OPENAI_API_KEY=tu_clave_de_openai
```

## Correr el backend

### Modo desarrollo

```bash
npm run start:dev
```

### Modo producción

```bash
npm run build
npm run start:prod
```

## Contribuciones

¡Son bienvenidas! Si querés colaborar, hacé un fork y mandá un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Mirá el archivo LICENSE para más detalles.
