/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rail-blue': '#00f3ff',
                'rail-amber': '#ffbe00',
                'rail-red': '#ff0055',
                'rail-green': '#00ff9d',
                'rail-dark': '#060a0f',
                'rail-card': 'rgba(10, 16, 24, 0.8)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scanline': 'scanline 10s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(1000%)' },
                }
            }
        },
    },
    plugins: [],
}
