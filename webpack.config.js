import path from 'path';

const webConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
        },
    },
    target: 'web',
    entry: './index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'raoi.js',
        library: {
            name: 'Raoi',
            type: 'var',
            export: 'default',
        },
    },
};

export default [webConfig];