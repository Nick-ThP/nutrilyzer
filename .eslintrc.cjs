module.exports = {
	root: true,
	env: { browser: true, es2020: true, node: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:node/recommended',
		'plugin:prettier/recommended',
		'prettier'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname
	},
	plugins: ['react-refresh', 'node', 'prettier'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: ['./tsconfig.json', './tsconfig.node.json']
			}
		}
	],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'node/no-unpublished-import': 'off',
		'prettier/prettier': 'error'
	},
	compilerOptions: {
		baseUrl: './',
		paths: {
			'*': ['*', '*.ts', '*.tsx']
		}
	}
}
