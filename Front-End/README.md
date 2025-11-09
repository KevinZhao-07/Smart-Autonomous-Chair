# The Goon Chair - Frontend

A modern, interactive Next.js web application for controlling the Goon Chair with a beautiful UI built using shadcn/ui components.

## Features

- 🎥 Livestream background with gradient overlay
- 🔊 10 different sound buttons with particle effects
- 🎯 Interactive controls (Track Person, Gooning Machine)
- 🖱️ Custom sperm cursor
- ✨ White particle effects on button clicks
- 🎨 Modern translucent glassmorphism design
- 📱 Responsive design for all screen sizes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the Front-End directory:
```bash
cd Front-End
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Front-End/
├── app/
│   ├── globals.css       # Global styles and animations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/
│   ├── ui/
│   │   └── button.tsx    # shadcn/ui button component
│   ├── CustomCursor.tsx  # Custom sperm cursor
│   ├── ParticleEffect.tsx # Particle animation effect
│   ├── SoundButton.tsx   # Sound button component
│   └── ControlButton.tsx # Control button component
└── lib/
    └── utils.ts          # Utility functions
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives

## Customization

### Adding Sound Files

To add actual sound files, update the `SoundButton` component to accept a `soundUrl` prop and place your sound files in the `public/sounds/` directory.

### Changing Colors

Modify the color scheme in `app/globals.css` under the `:root` CSS variables.

### Adjusting Particle Effects

Edit the `ParticleEffect` component to change particle count, speed, or appearance.

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

