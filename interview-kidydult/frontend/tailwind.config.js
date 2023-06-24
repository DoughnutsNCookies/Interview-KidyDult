/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
		extend: {
			colors: {
        highlight: "rgb(var(--highlight-color))",
        dimshadow: "rgb(var(--dimmer-shadow))",
        shadow: "rgb(var(--shadow-color))",
        accRed: "rgb(var(--accent-red))",
        accCyan: "rgb(var(--accent-cyan))",
        accYellow: "rgb(var(--accent-yellow))",
        accBriYellow: "rgb(var(--accent-bri-yellow))",
        accBlue: "rgb(var(--accent-blue))",
        accGreen: "rgb(var(--accent-green))",
			},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			fontFamily: {
				jbmono: ["JetBrains Mono"],
        bungee: ["Bungee"],
			}
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
