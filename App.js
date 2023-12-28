import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "InterTight-Black": require("./assets/fonts/InterTight-Black.ttf"),
    "InterTight-BlackItalic": require("./assets/fonts/InterTight-BlackItalic.ttf"),
    "InterTight-Bold": require("./assets/fonts/InterTight-Bold.ttf"),
    "InterTight-BoldItalic": require("./assets/fonts/InterTight-BoldItalic.ttf"),
    "InterTight-ExtraBold": require("./assets/fonts/InterTight-ExtraBold.ttf"),
    "InterTight-ExtraBoldItalic": require("./assets/fonts/InterTight-ExtraBoldItalic.ttf"),
    "InterTight-ExtraLight": require("./assets/fonts/InterTight-ExtraLight.ttf"),
    "InterTight-ExtraLightItalic": require("./assets/fonts/InterTight-ExtraLightItalic.ttf"),
    "InterTight-Italic": require("./assets/fonts/InterTight-Italic.ttf"),
    "InterTight-Light": require("./assets/fonts/InterTight-Light.ttf"),
    "InterTight-LightItalic": require("./assets/fonts/InterTight-LightItalic.ttf"),
    "InterTight-Medium": require("./assets/fonts/InterTight-Medium.ttf"),
    "InterTight-MediumItalic": require("./assets/fonts/InterTight-MediumItalic.ttf"),
    "InterTight-Regular": require("./assets/fonts/InterTight-Regular.ttf"),
    "InterTight-SemiBold": require("./assets/fonts/InterTight-SemiBold.ttf"),
    "InterTight-SemiBoldItalic": require("./assets/fonts/InterTight-SemiBoldItalic.ttf"),
    "InterTight-Thin": require("./assets/fonts/InterTight-Thin.ttf"),
    "InterTight-ThinItalic": require("./assets/fonts/InterTight-ThinItalic.ttf"),
    
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
