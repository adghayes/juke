module.exports = {
  purge: [
    "./pages/*.js",
    "./pages/**/*.js",
    "./components/*.jsx",
    "./hooks/*.jsx",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "480px",

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      width: {
        88: "22rem",
        128: "32rem",
        160: "40rem",
        192: "48rem",
      },
      maxWidth: {
        8: "8rem",
        12: "12rem",
        4: "4rem",
      },
      transitionDuration: {
        2000: "2000ms",
        5000: "5000ms",
        10000: "10000ms",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      borderRadius: ["focus"],
    },
  },
  plugins: [],
};
