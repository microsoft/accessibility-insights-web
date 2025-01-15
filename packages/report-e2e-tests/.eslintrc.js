import baseModule from './eslint.config.js';

module.exports = {
    ...baseModule,
    root: true,
    ignorePatterns: ['node_modules/', '**/*bundle.js', 'dist/', 'drop/', 'test-results/'],
};
