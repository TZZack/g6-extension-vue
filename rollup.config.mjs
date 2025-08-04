import nodePolyfills from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'G6ExtensionVue',
      sourcemap: false,
      inlineDynamicImports: true,
    },
    external: ['vue','@antv/g6'],
    plugins: [
      nodePolyfills(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.node.json',
      }),
      terser(),
    ],
  },
];