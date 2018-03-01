const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const nonTreeShakableModules = [
    'bootstrap',
    'bootstrap/dist/css/bootstrap.css',
    'es6-promise',
    'es6-shim',
    'event-source-polyfill',
    'jquery',
    'three',
    //'@webcomponents/custom-elements/src/native-shim.js',
    //'@webcomponents/custom-elements/custom-elements.min',
    //'@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    //'@webcomponents/webcomponentsjs/webcomponents-loader.js',
    
];
const allModules = nonTreeShakableModules;

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendorelements.css');
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.ProvidePlugin({ three: 'three' }), // Maps these identifiers to three
            //new webpack.ProvidePlugin({ customElements: 'customElements' }), // Maps these identifiers to customElements
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            // To keep development builds fast, include all vendor dependencies in the vendor bundle.
            // But for production builds, leave the tree-shakable ones out so the AOT compiler can produce a smaller bundle.
            'vendorelements':  allModules
        },
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) }
            ]
        },
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
        entry: { 'vendorelements': allModules.concat(['aspnet-prerendering']) },
        output: {
            path: path.join(__dirname, 'ClientApp', 'dist'),
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [ { test: /\.css(\?|$)/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize' ] } ]
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    //return [clientBundleConfig, serverBundleConfig];
    return [clientBundleConfig];
}
