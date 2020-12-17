global.console = {
  log: console.log,
  // silence the console errors about the theme registry
  error: jest.fn(),
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};
