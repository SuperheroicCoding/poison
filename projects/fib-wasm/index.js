export const imports = {
  env: {
    logRecCalls(recCalls) {
      console.log('Reccalls: ', recCalls);
    },
    abort(_msg, _file, line, column) {
      console.error('abort called at index.ts:' + line + ':' + column);
    },
  }
};
