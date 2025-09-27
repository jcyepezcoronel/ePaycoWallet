# ePaycoWallet Frontend

Interfaz web construida con Next.js que permite interactuar con los servicios REST de ePaycoWallet para registrar clientes, recargar la billetera, generar pagos y confirmar transacciones.

## Requisitos previos

- Node.js 20 o superior
- Backend del gateway en ejecución y accesible mediante la variable `NEXT_PUBLIC_API_URL`

## Variables de entorno

    ```bash
    cp .env.example .env
    ```

Ajuste el valor según la URL expuesta por el gateway.

## Scripts disponibles

```bash
npm run dev     # Inicia el servidor de desarrollo 
npm run build   # Genera la versión de producción
npm run start   # Sirve la compilación de producción
```

## Flujo funcional

1. **Registrar cliente**: crea el usuario y su billetera inicial.
2. **Recargar billetera**: incrementa el saldo disponible.
3. **Generar pago**: valida el saldo, genera un token de confirmación y un identificador de sesión.
4. **Confirmar pago**: valida el token e impacta el saldo.
5. **Consultar saldo**: muestra el saldo actual para un documento y celular válidos.

Cada formulario muestra las respuestas normalizadas del API para facilitar la validación manual.
