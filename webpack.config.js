// // webpack.config.js
// module.exports = {
//     // other webpack configurations...
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 use: [
//                     {
//                         loader: 'source-map-loader',
//                         options: {
//                             // Provide the correct path to the source map
//                             // for the flowbite module
//                             sourceMapPath: 'node_modules/flowbite/lib/esm/[file].map'
//                         }
//                     }
//                 ],
//                 // Exclude node_modules to avoid conflicts with other packages
//                 exclude: /node_modules\/(?!flowbite)/
//             }
//         ]
//     }
// };

// const path = require('path');
//
// module.exports = {
//     // other webpack configurations...
//     resolve: {
//         alias: {
//             // Redirect the flowbite/src/dom/events.ts source map path to the correct location
//             'flowbite/src/dom/events.ts.map': path.resolve(__dirname, 'node_modules/flowbite/lib/esm/dom/events.js.map')
//         }
//     }
// };

//
// const path = require('path');
//
// module.exports = {
//     // other webpack configurations...
//     module: {
//         rules: [
//             {
//                 test: /\.ts$/,
//                 enforce: 'pre',
//                 use: [
//                     {
//                         loader: 'source-map-loader',
//                         options: {
//                             // Custom function to dynamically resolve the source map paths
//                             sourceMapPath: (url, resourcePath) => {
//                                 if (url.startsWith('node_modules/flowbite/src/')) {
//                                     // Map the source map path to the correct location
//                                     return path.resolve(__dirname, 'node_modules/flowbite/lib/esm', url.replace('.ts', '.js.map'));
//                                 }
//                                 // Return the original URL for other source maps
//                                 return url;
//                             },
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
// };

// const path = require('path');
//
// module.exports = {
//     // other webpack configurations...
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 enforce: 'pre',
//                 use: [
//                     {
//                         loader: 'source-map-loader',
//                         options: {
//                             // Custom function to dynamically resolve the source map paths
//                             sourceMapPath: (url, resourcePath) => {
//                                 if (resourcePath.includes('flowbite') && url.startsWith('../src/')) {
//                                     // Adjust the path to point to the correct location in lib/esm
//                                     const correctedUrl = url.replace('../src/', '../lib/esm/');
//                                     return path.resolve(__dirname, 'node_modules', correctedUrl);
//                                 }
//                                 // For other source maps, return the original URL
//                                 return url;
//                             }
//                         }
//                     }
//                 ]
//             }
//         ]
//     }
// };

const path = require('path');

module.exports = {
    // other webpack configurations...
    test: /\.js$/,
    enforce: 'pre',
    use: [
        {
            loader: 'source-map-loader',
            options: {
                filterSourceMappingUrl: (url, resourcePath) => {
                    if ("/flowbite/src".test(resourcePath)) {
                        // return false;
                        resourcePath.split("src")
                        console.log('=== var name ===>', resourcePath.split("src"))
                        return __dirname, `node_modules/flowbite/lib/esm/${resourcePath.split("src")[1]}`

                    }

                    return true;
                },
            },
        },
    ],
};

// module.exports = {
//     // other webpack configurations...
//     resolve: {
//         alias: {
//             // Redirect the flowbite/src/ paths to flowbite/lib/esm/
//             'flowbite/src': 'flowbite/lib/esm'
//         }
//     }
// };
