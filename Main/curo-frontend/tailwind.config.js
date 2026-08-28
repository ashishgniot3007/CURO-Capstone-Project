/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1C22",
          soft: "#3A4A50",
        },
        paper: {
          DEFAULT: "#F6F8F7",
          dim: "#EEF2F0",
        },
        teal: {
          50: "#EAF3F1",
          100: "#DCEAE8",
          200: "#B7D6D1",
          300: "#8CBDB6",
          400: "#4E958C",
          500: "#0F5C56",
          600: "#0C4A45",
          700: "#093A36",
          800: "#072A27",
          900: "#051D1A",
        },
        pulse: {
          DEFAULT: "#E8604C",
          soft: "#F7DAD3",
          dim: "#FBEAE6",
        },
        line: "#DBE2DE",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,28,34,0.04), 0 8px 24px -12px rgba(15,28,34,0.12)",
        lift: "0 12px 32px -16px rgba(9,58,54,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseline: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        pulseline: "pulseline 2.4s linear infinite",
        blink: "blink 1.8s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
