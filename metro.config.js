// Learn more https://docs.expo.io/guides/customizing-metro
// + https://www.nativewind.dev/v5/getting-started/installation
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config);
