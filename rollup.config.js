import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: [
    {
      file: './dist/Spring.js',
      format: 'iife',
      name: 'Spring',
      globals: {
        react: 'React'
      }
    },
    {
      file: './dist/Spring.cjs.js',
      format: 'cjs',
    },
    {
      file: './dist/Spring.esm.js',
      format: 'es',
    }
  ],
  external: ['react'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    terser()
  ],
  watch: {
    include: 'src/**'
  }
};
