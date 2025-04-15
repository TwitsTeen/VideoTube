/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E2F",
        secondary: "#2A2A3D",
        tertiary: "#3E3E5B",
        accent: "#4F46E5",
      },
    },
  },
  plugins: [],
};
