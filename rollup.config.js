import { name, version } from './package.json';
import { DEFAULT_EXTENSIONS } from '@babel/core';
// import builtins from 'builtin-modules';

import alias from 'rollup-plugin-alias';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';

const banner = `/* ${name} version is ${version} */`;
const footer = '/* email: kimimi_king@163.com */';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

export default async () => ({
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    name: 'imageMarker',
    banner,
    footer,
    sourcemap: false,
    format: 'iife',
  },
  watch: {
    include: 'src/**',
  },
  // external: Object.keys(dependencies),
  plugins: [
    alias({
      resolve: ['.ts', '.js'],
      entries: [{ find: '@/(.*)', replacement: './src/$1' }],
    }),
    json(),
    resolve(),
    typescript2({ tsconfig: './tsconfig.json' }),
    commonjs({ include: '**/node_modules/**', extensions: ['.js', '.ts'] }),
    babel({
      exclude: '**/node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS],
    }),
    filesize(),
    isProduction && (await import('rollup-plugin-terser')).terser(),
  ],
});
