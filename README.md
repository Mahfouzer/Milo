# Millionaire Countries Calculator

A modern, interactive web application that calculates how many countries you're a millionaire in based on your net worth. Features an interactive D3.js world map, GSAP animations, multi-language support (Arabic, English, Spanish), and social sharing capabilities.

## Features

- 🌍 **Interactive World Map**: D3.js-powered map showing millionaire status by country
- 💰 **Real-time Calculations**: Debounced input with live currency conversion
- 🎨 **Beautiful Animations**: GSAP-powered smooth transitions and counter animations
- 🌐 **Multi-language Support**: Arabic (RTL), English, and Spanish
- 📱 **Social Sharing**: Generate and share Duolingo-style images to Facebook, LinkedIn, and WhatsApp
- 🔄 **Service Worker Caching**: Offline support with stale-while-revalidate strategy
- ♿ **Full WCAG Compliance**: Accessible to all users with keyboard navigation and screen reader support
- 🧪 **Comprehensive Testing**: Full test coverage with Vitest

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Maps**: D3.js + d3-geo + topojson-client
- **i18n**: react-i18next (ar/en/es)
- **Testing**: Vitest + React Testing Library
- **Service Worker**: Custom implementation with caching

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm test:ui
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── input/          # Input card component
│   ├── map/            # D3.js map component
│   ├── results/        # Results sidebar
│   ├── share/          # Social sharing
│   └── footer/         # Footer component
├── features/           # Feature modules
│   ├── calculator/     # Calculation logic
│   ├── currency/       # Currency API abstraction
│   └── sharing/        # Image generation
├── hooks/              # Custom React hooks
├── lib/                # Utilities
│   ├── d3/            # D3 map utilities
│   ├── i18n/          # i18n configuration
│   └── service-worker/ # Service worker
├── data/               # Static data files
├── locales/            # Translation files
└── routes/             # TanStack Router routes
```

## Currency API

The app uses an abstraction layer for currency exchange rates, currently configured with ExchangeRate-API (free tier). The architecture allows easy switching to paid providers like Fixer.io.

### Adding a New Provider

1. Create a new provider class implementing the `CurrencyProvider` interface
2. Add it to the `CurrencyService` in `src/features/currency/currency-service.ts`
3. Configure API keys in environment variables if needed

## How It Works

1. User enters their net worth in any supported currency
2. The app fetches current exchange rates (with caching)
3. Calculates equivalent amounts in all country currencies
4. Determines millionaire status (1M+ in local currency)
5. Visualizes results on an interactive world map
6. Shows detailed list sorted by amount

## Accessibility

- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- RTL support for Arabic
- High contrast color schemes
- Focus management

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

ISC

## Creator

Created by [@mahfouzer](https://twitter.com/mahfouzer)

---

**Note**: This project excludes Israel from country calculations as per requirements.

