# Vive Coffee Bar

Sitio web responsive hecho con React, TypeScript y Vite. Usa fotografías aportadas por Vive Coffee Bar.

## Ejecutar

```bash
npm install
cp .env.example .env
npm run dev
```

## Antes de publicar

1. Agrega el número oficial de WhatsApp en `VITE_WHATSAPP_NUMBER` dentro de `.env` (solo dígitos, con código de país). El formulario abrirá WhatsApp con la solicitud preparada; el cliente debe presionar **Enviar**. Sin número configurado, ofrece copiar la solicitud y no finge haberla enviado.
2. Si deseas mostrar Instagram, agrega el enlace oficial en `VITE_INSTAGRAM_URL`.
3. Confirma el contenido comercial de los tres paquetes y las bebidas disponibles antes de difundirlo.
4. Ejecuta `npm run build` y publica el contenido de `dist/` en tu hosting.

Las variables `VITE_` se incorporan al sitio compilado; nunca incluyas secretos en ellas. No hay servidor ni almacenamiento de datos personales.
