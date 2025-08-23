export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'axios'],
        },
      },
    },
  },
}