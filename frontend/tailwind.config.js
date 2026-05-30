/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    colors: {
      "white": "#FFFFFF",
      "black": "#000000",
      "primary-bg":"#ADAFEA",
      "primary":"#9652E4",
      "secondary-bg":"#EFF2AB",
      "secondary":"#F3EB95",
      "ternary": "#DBF2B6",
      "warning": "#F4C107",
      "error": "#FF0707",
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
}

