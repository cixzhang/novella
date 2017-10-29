import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'lib/deps-rollup.js',
  output: {
    file: 'lib/deps.build.js',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: true }),
    json(),
  ],
};

