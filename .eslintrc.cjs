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
		'plugin:prettier/recommended'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'postcss.config.js', 'tailwind.config.js'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname
	},
	plugins: ['react-refresh', 'node'],
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
		'node/no-unpublished-import': 'off'
	},
	compilerOptions: {
		baseUrl: './',
		paths: {
			'*': ['*', '*.ts', '*.tsx']
		}
	}
}
