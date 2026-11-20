import {SplashScreen, Stack} from "expo-router";
import "@/global.css";

export default function RootLayout() {
  // Fonts are loaded at build time via the expo-font config plugin in app.json.
  // No useFonts hook needed — hiding splash screen immediately.
  SplashScreen.hideAsync();

  return <Stack screenOptions={{ headerShown: false }} />;
}
