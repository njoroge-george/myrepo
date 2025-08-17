// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend server
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
};
