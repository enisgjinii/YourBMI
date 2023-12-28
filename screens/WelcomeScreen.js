import React from "react";
import { View, Text, StyleSheet, ImageBackground,StatusBar } from "react-native";
import { Button } from "react-native-paper";

function WelcomeScreen({ navigation }) {
  return (
    <>
      <StatusBar barStyle="light-content" paddingTop={Platform.OS === "android" ? 25 : 0} backgroundColor="blue" />
      <ImageBackground
        source={{ uri: "background_image_url" }}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to YourBMI</Text>
          <Text style={styles.description}>
            Your personal BMI tracker and advisor.
          </Text>
          <Button
            mode="outlined"
            theme={{ colors: { primary: "white" } }}
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Button>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    maxWidth: 400,
    maxHeight: 600,
    marginHorizontal: "10%",
    marginVertical: "10%",
    
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "InterTight-ExtraBold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "InterTight-SemiBold",
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
    textTransform: "none",
    borderRadius: 15,
    marginVertical: 10,
    backgroundColor: "blue",
  },
  buttonText: {
    color: "white",
    fontFamily: "InterTight-Bold",
    fontSize: 20,
  },
});

export default WelcomeScreen;
