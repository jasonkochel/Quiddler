const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        "card-back": "url('/src/card-back.jpg')",
      },
      colors: {
        green: colors.green,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
