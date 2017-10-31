
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'deps.js',
  output: {
    file: 'lib/deps.build.js',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: true }),
    json(),
  ],
  external: [
    'util',
    'path',
    'fs',
    'events',
    'module',
    'os',
    'http',
    'https',
    'url',
    'stream',
    'buffer',
    'crypto',
    'tty',
    'net',
    'string_decoder',
    'typescript', // used by rollup-plugin-vue
    'uglify-js',
    'aws-sign2',
    'stylus',
  ],
};

