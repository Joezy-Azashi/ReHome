/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs" : {'min': '350px', 'max': '639px'},
        "ipad" : {'min': '768px', 'max': '1023px'},
        "ipad-pro" : {'min': '1024px', 'max': '1024px'},
        "mini-desktop" : {'min': '1025px', 'max': '1210px'},
        "navitems-breakpoint" : {'min': '1023px'},
      },
    },
  },
  plugins: [],
}
