import { Platform } from "react-native";

export default Platform.select({
  ios: require("./BackButton.ios").default,
  android: require("./BackButton.android").default,
  default: require("./BackButton.ios").default,
});
