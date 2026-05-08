module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#4ade80",
          "green-dim": "#22c55e",
          dark: "#0f1117",
          darker: "#090c10",
          card: "#161b22",
        },
      },
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
        display: ["Barlow Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};
