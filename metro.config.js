const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const sentryConfig = getSentryExpoConfig(__dirname);

module.exports = withNativeWind(sentryConfig, { input: "./app/global.css" });
