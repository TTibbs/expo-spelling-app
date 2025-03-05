import React, { useEffect } from "react";
import { Stack, Slot, useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ChildProvider } from "@/context/ChildContext";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import "./global.css";

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: __DEV__, // Only enable debug in development
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  enableAutoSessionTracking: true,
});

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

function RootLayout() {
  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (Platform.OS === "web") {
      window.frameworkReady?.();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ChildProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "#101124" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="word/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ChildProvider>
    </GestureHandlerRootView>
  );
}

// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(RootLayout);
