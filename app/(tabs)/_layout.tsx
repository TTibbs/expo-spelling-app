import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";

function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="words"
        options={{
          title: "Words",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: "Chores",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: "#1E5BFF",
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
