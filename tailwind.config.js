/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root', // MUI와의 우선순위 충돌 방지
  theme: {
    extend: {},
  },
  plugins: [],
}
