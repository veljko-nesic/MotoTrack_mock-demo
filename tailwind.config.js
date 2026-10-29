const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F8F7",
        ink: "#0F1A15",
        mute: "#6B7A73",
        brand: "#1DB876",
        mint: "#E3F7EC",
        peach: "#FFF1DE",
        sky: "#EBF0FF",
        lilac: "#EFEBFF",
        danger: "#E5484D",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 26, 21, 0.06)",
        soft: "0 1px 2px rgba(15, 26, 21, 0.05), 0 16px 40px rgba(15, 26, 21, 0.08)",
      },
      borderRadius: {
        card: "22px",
      },
    },
  },
  plugins: [],
};
