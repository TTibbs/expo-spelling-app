import { Stack } from "expo-router";
import BackButton from "../../components/BackButton";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerLeft: () => <BackButton />,
      }}
    />
  );
}
