const path = require('path'); // ← Asegúrate de importar path
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'), // ← Añade esto
        publicPath: '/' // ← Este ya lo tenías
    },
    plugins: [
        new Dotenv({
            safe: false,
            systemvars: true
        })
    ]
});
