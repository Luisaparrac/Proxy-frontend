# Proxy Frontend — Medidor IA

Interfaz en **React + Vite** para la plataforma de consumo de IA con proxy de rate limiting y cuotas. Consume la API de [Proxy-backend](https://github.com/Luisaparrac/Proxy-backend).

## Funcionalidades

- Chat para enviar prompts al servicio de IA simulado.
- Medidor de cuota: barra de progreso con tokens usados vs. disponibles, se actualiza después de cada request.
- Contador de solicitudes por minuto con cuenta regresiva hasta el reinicio.
- Al alcanzar el rate limit (429) se deshabilita el botón de envío y se muestra la cuenta regresiva (usa el header `Retry-After`).
- Al agotar la cuota mensual (402) se abre un modal de upgrade a PRO con pago simulado.
- Gráfica de barras con el uso diario de los últimos 7 días.
- Badge del plan actual (FREE, PRO, ENTERPRISE) con colores diferenciados.
- Estimador: antes de enviar muestra cuántos tokens aproximados consumirá el prompt.

## Estructura

```
src
├── App.jsx                     # Orquesta el estado de la página
├── components
│   ├── chat/                   # ChatPanel, MessageList, MessageBubble, PromptComposer
│   ├── layout/                 # AppHeader, ConnectionError
│   ├── quota/                  # PlanBadge, QuotaMeter, RateLimitCounter, UsageHistoryChart
│   └── upgrade/                # UpgradeModal, PlanComparison, PaymentForm
├── config/env.js               # URL del backend (VITE_API_URL)
├── constants/plans.js          # Límites de cada plan
├── hooks/                      # useUsers, useQuota, useChat, useNow
├── services/                   # Clases: ApiClient, ApiError, AIService, QuotaService,
│                               #   UserService, TokenEstimator, PaymentSimulator
├── styles/                     # tokens, layout y componentes
└── utils/format.js             # Formato de números y fechas (es-CO)
```

## Ejecutar en local

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no está en localhost:8080
npm run dev
```

Abre `http://localhost:5173`.

## Cómo probar los casos clave

- **Rate limit (429):** elige a *Ana Gómez* (FREE) y envía más de 10 prompts en un mismo minuto.
- **Cuota agotada (402):** elige a *Carlos Ruiz* (FREE, casi sin tokens) y envía unos pocos prompts; se abre el modal de upgrade.
- **Pago simulado:** pulsa "Usar tarjeta de prueba" (4242 4242 4242 4242). No se hace ningún cobro.
- **Sin límites:** elige a *Acme Corp* (ENTERPRISE).


