export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // default body font
        mono: ["Roboto Mono", "monospace"], // for special headings or code-style text
      },
      keyframes: {
        bounceOnce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
      animation: {
        bounceOnce: "bounceOnce 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
