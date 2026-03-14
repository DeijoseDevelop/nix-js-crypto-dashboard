# 🚀 Nix-js Crypto Dashboard

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/@deijose/nix-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una terminal de trading de criptomonedas premium, ultra-rápida y reactiva, construida íntegramente con **Nix.js**. Este proyecto demuestra el poder de la reactividad basada en signals en una interfaz de alta fidelidad con cero pasos de compilación.

## ❄️ ¿Por qué Nix.js?

Este dashboard aprovecha las capacidades centrales de Nix.js para ofrecer una experiencia de usuario fluida:
- **Signals-Based Reactivity**: Actualizaciones granulares en el DOM sin re-renders innecesarios.
- **Zero Build Tooling**: Funciona directamente en el navegador usando ES Modules.
- **Micro-Framework Architecture**: Todo el motor de la aplicación pesa menos de 10KB.

## ✨ Características Principales

- **Market Tracking**: Datos en tiempo real de los líderes del mercado mediante la API de CoinGecko.
- **Advanced Caching**: Sistema de caché inteligente que combina `localStorage` con almacenamiento en memoria para una respuesta instantánea y reducción de consumo de API.
- **Premium UI**: Interfaz oscura con efectos de glassmorphism, micro-animaciones y diseño responsivo.
- **Trade Simulator**: Panel interactivo para simular operaciones de trading con confirmaciones reactivas.
- **Engine Stats**: Visualización en tiempo real de las métricas del motor Nix (Signals activas, efectos y watchers).

## 🛠️ Tecnologías

- **Nix.js**: Motor de reactividad y lógica.
- **Vanilla CSS**: Variables CSS modernas para un sistema de diseño dinámico.
- **CoinGecko API**: Fuente de datos de mercado.
- **Native Web APIs**: `fetch`, `localStorage`, `Signals`.

## 🚀 Instalación y Uso Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/DeijoseDevelop/nix-js-crypto-dashboard.git
   cd nix-js-crypto-dashboard
   ```

2. **Inicia el servidor local:**
   Puedes usar cualquier servidor estático. Si tienes `npx` instalado:
   ```bash
   npx serve .
   ```

3. **Accede a la App:**
   Abre tu navegador en `http://localhost:3000` (o el puerto que indique tu terminal).

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Creado con ❤️ por **Deiver Vasquez (DeijoseDevelop)**.
