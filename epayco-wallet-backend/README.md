# ePaycoWallet Backend

El backend está compuesto por dos servicios independientes construidos con Express:

1. **database-service**: expone la API REST que interactúa directamente con MongoDB mediante Mongoose.
2. **gateway-service**: actúa como fachada pública y reenvía las peticiones al servicio de base de datos.

## Requisitos previos

- Node.js 20 o superior
- Acceso a una instancia de MongoDB (Atlas o local)

## Instalación

Desde el directorio `epayco-wallet-backend` ejecute:

```bash
npm run install:all
```

Esto instalará las dependencias de ambos servicios usando workspaces.

## Configuración

Copie el archivo `.env.example` de cada servicio y ajuste los valores necesarios.

```bash
cd database-service
cp .env.example .env

cd ../gateway-service
cp .env.example .env
```

## Ejecución en desarrollo

En terminales separadas ejecute:

```bash
npm run dev:database   # levanta el servicio de base de datos 
npm run dev:gateway    # levanta el gateway público 
```

Los endpoints disponibles a través del gateway se encuentran bajo `/api`:

- `POST /api/clients/register`
- `POST /api/wallets/top-up`
- `GET /api/wallets/balance`
- `POST /api/payments/initiate`
- `POST /api/payments/confirm`

Todas las respuestas siguen la estructura `{ success, code, message, data }` para facilitar el consumo desde el frontend.