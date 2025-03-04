import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PinModalProps } from "@/types/common";

const PIN_KEY = "parental_control_pin";
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const PinModal: React.FC<PinModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
  setupMode = false,
}) => {
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isSettingUp, setIsSettingUp] = useState<boolean>(setupMode);
  const [error, setError] = useState<string>("");
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardWillShow = (e: any) => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const checkPin = async () => {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!savedPin && !setupMode) {
        setIsSettingUp(true);
      }
    };

    if (isVisible) {
      checkPin();
      // Focus the input after the modal is visible
      const timer = setTimeout(
        () => {
          pinInputRef.current?.focus();
        },
        Platform.OS === "ios" ? 300 : 100
      );
      return () => clearTimeout(timer);
    } else {
      setPin("");
      setConfirmPin("");
      setError("");
    }
  }, [isVisible, setupMode]);

  const handlePinChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPin(numericValue);
    setError("");

    if (numericValue.length === 4 && isSettingUp) {
      confirmPinInputRef.current?.focus();
    }
  };

  const handleConfirmPinChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setConfirmPin(numericValue);
    setError("");
  };

  const handleSubmit = async () => {
    if (isSettingUp) {
      if (pin.length < 4) {
        setError("PIN must be at least 4 digits");
        return;
      }

      if (pin !== confirmPin) {
        setError("PINs do not match");
        return;
      }

      try {
        await SecureStore.setItemAsync(PIN_KEY, pin);
        Alert.alert("Success", "Parental PIN has been set");
        setIsSettingUp(false);
        onSuccess();
      } catch (e) {
        setError("Failed to save PIN");
        console.error(e);
      }
    } else {
      try {
        const savedPin = await SecureStore.getItemAsync(PIN_KEY);
        if (pin === savedPin) {
          onSuccess();
        } else {
          setError("Incorrect PIN");
          setPin("");
          pinInputRef.current?.focus();
        }
      } catch (e) {
        setError("Error verifying PIN");
        console.error(e);
      }
    }
  };

  const modalPosition =
    Platform.OS === "ios"
      ? {
          top: keyboardHeight
            ? (SCREEN_HEIGHT - keyboardHeight) / 4
            : SCREEN_HEIGHT / 3,
        }
      : {};

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : "padding"}
          style={[styles.keyboardAvoidingView, modalPosition]}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={40} color="#6366F1" />
            </View>

            <Text style={styles.title}>
              {isSettingUp ? "Set Parental PIN" : "Enter Parental PIN"}
            </Text>

            <Text style={styles.subtitle}>
              {isSettingUp
                ? "Create a PIN to protect parental control settings"
                : "Enter your PIN to access parental controls"}
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <TextInput
                ref={pinInputRef}
                style={styles.input}
                value={pin}
                onChangeText={handlePinChange}
                maxLength={4}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="Enter PIN"
                placeholderTextColor="#94A3B8"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (isSettingUp && pin.length === 4) {
                    confirmPinInputRef.current?.focus();
                  } else if (!isSettingUp && pin.length === 4) {
                    handleSubmit();
                  }
                }}
              />

              {isSettingUp && (
                <TextInput
                  ref={confirmPinInputRef}
                  style={styles.input}
                  value={confirmPin}
                  onChangeText={handleConfirmPinChange}
                  maxLength={4}
                  keyboardType="number-pad"
                  secureTextEntry
                  placeholder="Confirm PIN"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (confirmPin.length === 4) {
                      handleSubmit();
                    }
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!isSettingUp && pin.length !== 4) ||
                (isSettingUp && (pin.length !== 4 || confirmPin.length !== 4))
                  ? styles.buttonDisabled
                  : null,
              ]}
              onPress={handleSubmit}
              disabled={
                (!isSettingUp && pin.length !== 4) ||
                (isSettingUp && (pin.length !== 4 || confirmPin.length !== 4))
              }
            >
              <Text style={styles.buttonText}>
                {isSettingUp ? "Set PIN" : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F8FAFC",
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default PinModal;
