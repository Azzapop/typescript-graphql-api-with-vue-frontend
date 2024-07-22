export default {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: [
    // Have to import this directly or prettier-nvim won't pick it up for some reason
    import.meta.resolve('@trivago/prettier-plugin-sort-imports'),
  ],
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
};
