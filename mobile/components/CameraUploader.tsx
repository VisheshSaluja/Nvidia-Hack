import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  label: string;
  onPick: (uri: string) => void;
};

export default function CameraUploader({ label, onPick }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePick = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed to capture the prescription.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onPick(uri);
    }
  };

  const handleLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onPick(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>
        {label}
      </Text>
      <View style={styles.buttons}>
        <Button mode="contained-tonal" onPress={handlePick}>
          Use Camera
        </Button>
        <Button mode="outlined" onPress={handleLibrary}>
          Choose Photo
        </Button>
      </View>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  label: {
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
});
