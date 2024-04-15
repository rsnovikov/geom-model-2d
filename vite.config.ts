import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(
   { 
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
      ],
    },
  }
  )],
})
