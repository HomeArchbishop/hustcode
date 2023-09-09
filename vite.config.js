export default {
  build: {
    lib: {
      name: 'hustcode',
      fileName: () => 'hustcode.user.js',
      entry: 'src/index',
      formats: ['umd']
    }
  }
}
