module.exports = {
  root: true,
  rules: {
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'only-multiline'],
    'max-len': [
      'error',
      {
        code: 100,
        comments: 80,
      },
    ],
  },
};
