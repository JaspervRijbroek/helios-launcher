const {renameSync} = require('fs');
const {parse, format} = require('path');

module.exports = {
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "helios_launcher"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        }
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            html: "./src/index.html",
                            js: "./src/renderer.js",
                            name: "main_window"
                        }
                    ]
                }
            }
        ]
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "JaspervRijbroek",
                    name: "helios-launcher"
                },
                prerelease: true
            }
        }
    ],
    hooks: {
        // All of the configuration options that would be in config.forge if you used the package.json method
        postMake: function (forgeConfig, outputs) {
            // Update file names.
            return outputs.map((output) => {
                if(output.platform === 'win32' && output.arch === 'x64') {
                    output.artifacts = output.artifacts.map((artifactPath) => {
                        let parts = parse(artifactPath);
                        parts.name += '-x64';
                        parts.base = parts.base.replace(parts.ext, '') + '-x64' + parts.ext;

                        let newPath = format(parts);

                        renameSync(artifactPath, newPath);

                        return newPath;
                    });
                }

                return output;
            });
        }
    }
};