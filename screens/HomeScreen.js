import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import {
  Text,
  Divider,
  TextInput,
  Card,
  Button,
  Appbar,
  TextInputMask,
} from "react-native-paper";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

function HomeScreen({ navigation }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [error, setError] = useState("");
  const resultContainerRef = useRef(); // Reference to the result container

  const [isSaving, setIsSaving] = useState(false); // State to track saving state
  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }

  const validateInput = () => {
    if (!height || !weight) {
      setError("Please enter both height and weight.");
      return false;
    }
    if (isNaN(height) || isNaN(weight)) {
      setError("Height and weight must be numbers.");
      // Clear the input fields
      setHeight("");
      setWeight("");
      setBmi(null);
      setBmiCategory("");
      interpretBMI(null);

      return false;
    }
    if (height <= 0 || weight <= 0) {
      setError("Height and weight must be greater than zero.");
      // Clear the input fields
      setHeight("");
      setWeight("");
      setBmi(null);
      setBmiCategory("");
      interpretBMI(null);
      return false;
    }

    // Adding new validation for realistic human measurements
    if (height < 50 || height > 250 || weight < 10 || weight > 500) {
      setError(
        "Height must be between 50 cm and 250 cm and weight must be between 10 kg and 500 kg."
      );
      // Clear the input fields
      setHeight("");
      setWeight("");
      setBmi(null);
      setBmiCategory("");
      interpretBMI(null);
      return false;
    }

    setError("");
    return true;
  };

  const calculateBMI = () => {
    if (validateInput()) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setBmi(bmi.toFixed(2));
      interpretBMI(bmi);
    } else {
      Alert.alert("Input Error", error);
    }
  };

  const interpretBMI = (bmi) => {
    if (bmi < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setBmiCategory("Normal weight");
    } else if (bmi >= 25 && bmi <= 29.9) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obesity");
    }
  };
  const requestMediaLibraryPermission = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY_WRITE_ONLY
    );
    return status === "granted";
  };

  const onSaveImageAsync = async () => {
    // Dont save if they are empty values or not valid
    if (!validateInput()) {
      return;
    }
    try {
      if (isSaving) {
        return; // Ignore if already in the saving state
      }

      // Display a confirmation alert
      Alert.alert(
        "Confirm Save",
        "Do you want to save the BMI result as an image?",
        [
          {
            text: "Cancel",
            onPress: () => {
              // User canceled, do nothing
            },
            style: "cancel",
          },
          {
            text: "Save",
            onPress: async () => {
              setIsSaving(true); // Set the saving state to true

              if (resultContainerRef.current) {
                const localUri = await captureRef(resultContainerRef, {
                  format: "jpg", // Specify the desired image formatr
                  quality: 1, // Image quality (1 = maximum quality)
                });

                const asset = await MediaLibrary.createAssetAsync(localUri);
                const album = await MediaLibrary.getAlbumAsync("BMI Results");

                if (album === null) {
                  await MediaLibrary.createAlbumAsync(
                    "BMI Results",
                    asset,
                    false
                  );
                } else {
                  await MediaLibrary.addAssetsToAlbumAsync(
                    [asset],
                    album,
                    false
                  );
                }

                Alert.alert(
                  "Image Saved",
                  "BMI result has been saved as an image."
                );
              }

              // Reset the saving state to false after 2 seconds
              setTimeout(() => {
                setIsSaving(false);
              }, 2000);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "An error occurred while saving the image.");
      setIsSaving(false); // Reset the saving state in case of an error
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        paddingTop={Platform.OS === "android" ? 25 : 0}
        backgroundColor="blue"
      />
      <ScrollView style={styles.scrollView}>
        <Appbar.Header theme={{ colors: { primary: "blue" } }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack(); // Now this should work correctly
            }}
          />
          <Appbar.Content title="Calculate BMI" />
          <Appbar.Action
            icon="information-outline"
            onPress={() => {
              Alert.alert(
                "Information about BMI (Body Mass Index)",
                "The BMI (Body Mass Index) is a measure of body fat based on height and weight! The BMI is calculated by dividing your weight in kilograms by your height in meters squared. For example, if your weight is 72 kg and your height is 1.8 m, your BMI would be 72 ÷ (1.8 × 1.8) = 24.8.",
                [
                  {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                  },
                ],
                { cancelable: true }
              );
            }}
          />
          <Appbar.Action
            icon={isSaving ? "clock" : "content-save"} // Change icon based on the saving state
            onPress={onSaveImageAsync}
          />
        </Appbar.Header>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>List of BMI Categories</Text>
            <Text style={styles.cardText}>Underweight = Below 18.5</Text>
            <Text style={styles.cardText}>Normal weight = 18.5–24.9</Text>
            <Text style={styles.cardText}>Overweight = 25–29.9</Text>
            <Text style={styles.cardText}>Obesity = BMI of 30 or greater</Text>
          </View>

          <TextInput
            label="Height (cm)"
            value={height}
            onChangeText={(text) => setHeight(text)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            error={!!error}
            outlineColor="lightgrey"
            activeOutlineColor="blue"
            dense
            mask="+[00] [000] [000] [000]"
          />
          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={(text) => setWeight(text)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            error={!!error}
            outlineColor="lightgrey"
            activeOutlineColor="blue"
            cursorColor="blue"
            dense
          />
          <Button
            title="Calculate"
            mode="contained"
            style={styles.button}
            onPress={calculateBMI}
            cursorColor="blue"
          >
            Calculate BMI
          </Button>
          <Divider />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {bmi && (
            <ScrollView
              ref={resultContainerRef}
              style={{ backgroundColor: "white", padding: 20 }}
            >
              <View style={styles.resultContainer}>
                <Text style={styles.result}>Your BMI: {bmi}</Text>
                <Text style={styles.category}>Category: {bmiCategory}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxHeight: 600,
    marginHorizontal: "0%",
    marginVertical: "0%",
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "InterTight-ExtraBold",
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "InterTight-Medium",
  },
  input: {
    width: "100%",
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
    width: "100%",
    textTransform: "none",
    borderRadius: 15,
    marginVertical: 10,
    backgroundColor: "blue",
  },
  result: {
    fontSize: 20,
    fontFamily: "InterTight-Bold",
  },
  category: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
  errorText: {
    marginTop: 10,
    color: "red",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "InterTight-Medium",
  },
});

export default HomeScreen;
