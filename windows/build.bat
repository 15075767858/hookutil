# Electron's version.
set npm_config_target=1.7.9
# The architecture of Electron, can be ia32 or x64.
set npm_config_arch=ia32
set npm_config_target_arch=ia32
# Download headers for Electron.
set npm_config_disturl=https://atom.io/download/electron
# Tell node-pre-gyp that we are building for Electron.
set npm_config_runtime=electron
# Tell node-pre-gyp to build module from source code.
set npm_config_build_from_source=true
# Install all dependencies, and store cache to ~/.electron-gyp.
set HOME=~/.electron-gyp npm install
node-gyp rebuild