module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'index.bundle.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.ts']
    }
}