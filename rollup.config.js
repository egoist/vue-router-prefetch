export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/vue-router-prefetch.cjs.js', format: 'cjs', sourcemap: true },
    { file: 'dist/vue-router-prefetch.esm.js', format: 'es', sourcemap: true }
  ],
  plugins: [
    require('rollup-plugin-node-resolve')(),
    require('rollup-plugin-buble')({
      transforms: { dangerousForOf: true }
    }),
    require('rollup-plugin-terser').terser()
  ]
}
