import { defineConfig } from 'vitest/config'
import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs'
import react from '@vitejs/plugin-react'

import type { Plugin } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

/* Check that required environment variables are set
  For now we are only checking variables that are required for both dev and production
*/
const envVarValidationPlugin = (): Plugin => {
  return {
    name: 'env-validation',
    configResolved(config) {
      const requiredEnvVars = ['VITE_SENTRY_DSN', 'VITE_CAPTCHA_KEY']
      const errorList: string[] = []
      requiredEnvVars.forEach((varName) => {
        if (!config.env[varName]) {
          errorList.push(varName)
        }
      })
      if (errorList.length > 0) {
        throw new Error(
          `Error: Missing the following required environment variables:\n${errorList.join('\n')}`
        )
      }
    },
  }
}

const isProduction = process.env.NODE_ENV === 'production'

/* Get the current git commit hash and build time.
 These are shown in the footer of the site.
 They are also used by the code-deploy script to determine if the site has successfully deployed.
 */
const buildHash = execSync('git rev-parse --short HEAD').toString().trim()
const buildTime = new Date().toISOString()

const buildInfoPlugin = (): Plugin => {
  return {
    name: 'build-info',
    writeBundle() {
      const info = JSON.stringify({ hash: buildHash, time: buildTime })
      fs.writeFileSync(path.resolve(__dirname, 'dist/build-info.json'), info)
    },
  }
}

export default defineConfig({
  define: {
    __BUILD_HASH__: JSON.stringify(buildHash),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  build: {
    sourcemap: true,
  },
  assetsInclude: ['/posts/*.md'] /* Let Vite know to include MD files in the build */,
  plugins: [
    react(),
    envVarValidationPlugin(),
    buildInfoPlugin(),
    // Docs: "Put the Sentry vite plugin after all other plugins"
    // Sentry messes up hot reloading if this is loaded here in dev mode.
    ...(isProduction
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN, // Remember that process.env will not work in browser code, so this should stay in this file.
            org: 'mywebsites',
            project: 'cjpro',
          }),
        ]
      : []),
  ],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@util': path.resolve(__dirname, './src/util'),
    },
  },
})
