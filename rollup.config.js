import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';


module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: './dist/bundle.esm.js',
      format: 'esm'
    },
    {
      file: './dist/bundle.iife.js',
      format: 'iife',
      name: 'iobio',
    },
    //{
    //  file: './dist/bundle.cjs.js',
    //  format: 'cjs'
    //},
  ],
  plugins: [
    resolve(),
    //builtins(),
  ],
};
