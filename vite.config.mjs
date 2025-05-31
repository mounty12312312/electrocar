// To avoid the CJS deprecation warning, use ESM for Vite config.
// Rename this file to vite.config.mjs and update the syntax:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// ---
// To apply this fix:
// 1. Rename vite.config.js to vite.config.mjs
// 2. (Optional) If you use any require() or module.exports, convert them to ESM import/export.
// 3. No code changes are needed if you already use ESM syntax as above.
// ---
