export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-router-prefetch.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    { file: 'dist/vue-router-prefetch.esm.js', format: 'es' }
  ],
  plugins: [
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-buble')({
      transforms: { dangerousForOf: true }
    }),
    require('rollup-plugin-terser').terser()
  ]
}
