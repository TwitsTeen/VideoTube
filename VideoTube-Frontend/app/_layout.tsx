import { Stack } from "expo-router";
import "./global.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="video/[id]"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="profile/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
