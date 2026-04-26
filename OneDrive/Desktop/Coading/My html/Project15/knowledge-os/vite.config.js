import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const env = globalThis.process?.env ?? {}
const repositoryName = env.GITHUB_REPOSITORY?.split('/')[1]
const pagesBase = env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase,
  plugins: [react()],
})
