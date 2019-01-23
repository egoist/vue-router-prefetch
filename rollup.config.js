export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    file: 'dist/index.js'
  },
  plugins: [
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-buble')({
      transforms: { dangerousForOf: true }
    }),
    require('rollup-plugin-terser').terser()
  ]
}
