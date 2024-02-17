// <!-- this file for the Vite which load Front-end vert fast for the development. Copied from https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate/blob/main/src/index.tsx--> also added the postcss
const { join } = require('path');
module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
