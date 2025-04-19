import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <>
    <AuthProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="register/index" options={{ headerShown: false }} />
      </Stack>
      </AuthProvider>
    </>
  );
}
