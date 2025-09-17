/**
 * Jest configuration for TypeScript project
 */
module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'clover'],
	setupFilesAfterEnv: [],
	reporters: ['default'],
	maxWorkers: 2
};
