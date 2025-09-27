# ePaycoWallet

# ePaycoWallet

Solución de billetera virtual compuesta por dos servicios backend en Node.js y un frontend en React/Next.js. La arquitectura sigue el patrón solicitado: un servicio con acceso directo a la base de datos y un gateway que actúa como intermediario para el cliente web.

## Estructura del repositorio

- `epayco-wallet-backend/`
  - `database-service/`: API REST conectada a MongoDB mediante Mongoose.
  - `gateway-service/`: fachada pública que delega las operaciones en el servicio anterior.
- `epayco-wallet-front/`: aplicación Next.js que consume el gateway para gestionar clientes y movimientos de la billetera.

## Requisitos previos

- Node.js 20  +
- Acceso a una base de datos MongoDB. Para desarrollo puedes usar la conexión compartida de Atlas.

## Configuración paso a paso

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/jcyepezcoronel/ePaycoWallet.git
   cd ePaycoWallet
   ```

2. **Instalar dependencias del backend**

   ```bash
   cd epayco-wallet-backend
   npm run install:all
   ```

3. **Configurar variables de entorno**

   - Servicio de base de datos:

     ```bash
     cd database-service
     cp .env.example .env
     ```

   - Gateway:

     ```bash
     cd ../gateway-service
     cp .env.example .env
     ```

4. **Iniciar los servicios backend** (en terminales separadas):

   ```bash
   # terminal 1
   cd epayco-wallet-backend/database-service
   npm run dev

   # terminal 2
   cd epayco-wallet-backend/gateway-service
   npm run dev
   ```

   Por defecto el servicio de base de datos corre en `http://localhost:5001` y el gateway en `http://localhost:4000`. El gateway expone los endpoints:

   - `POST /api/clients/register`
   - `POST /api/wallets/top-up`
   - `GET /api/wallets/balance`
   - `POST /api/payments/initiate`
   - `POST /api/payments/confirm`

5. **Instalar y configurar el frontend**

   ```bash
   cd ../../epayco-wallet-front
   npm install
   cp .env.local.example .env.local
   ```

6. **Levantar el frontend**

   ```bash
   npm run dev
   ```

   La aplicación queda disponible en `http://localhost:3000` y permite:

   - Registrar clientes y su billetera.
   - Recargar saldo.
   - Generar una compra con token de confirmación (el token se muestra en pantalla y se envía por correo).
   - Confirmar pagos con el token recibido.
   - Consultar el saldo disponible.

> Para más detalles sobre scripts adicionales o despliegue revisa los README específicos en `epayco-wallet-backend/` y `epayco-wallet-front/`.
