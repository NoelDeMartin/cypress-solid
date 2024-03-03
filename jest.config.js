const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
    preset: 'ts-jest/presets/js-with-babel',
    testRegex: '\\.test\\.ts$',
    moduleFileExtensions: ['js', 'ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
};
