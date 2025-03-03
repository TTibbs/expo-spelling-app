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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PinModalProps } from "@/types/common";

const PIN_KEY = "parental_control_pin";

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

  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Check if PIN already exists
    const checkPin = async () => {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!savedPin && !setupMode) {
        setIsSettingUp(true);
      }
    };

    if (isVisible) {
      checkPin();
      // Focus the input when modal opens
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 100);
    } else {
      // Reset state when modal closes
      setPin("");
      setConfirmPin("");
      setError("");
    }
  }, [isVisible, setupMode]);

  const handlePinChange = (text: string) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, "");
    setPin(numericValue);
    setError("");

    // Auto-move to confirm field when 4 digits entered
    if (numericValue.length === 4 && isSettingUp) {
      confirmPinInputRef.current?.focus();
    }
  };

  const handleConfirmPinChange = (text: string) => {
    // Only allow digits
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
        }
      } catch (e) {
        setError("Error verifying PIN");
        console.error(e);
      }
    }
  };

  const resetPin = async () => {
    if (confirm("Are you sure you want to reset your PIN?")) {
      try {
        await SecureStore.deleteItemAsync(PIN_KEY);
        setIsSettingUp(true);
        setPin("");
        setConfirmPin("");
        setError("");
        Alert.alert("PIN Reset", "Please set up a new PIN");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isSettingUp ? "Set PIN" : "Submit"}
            </Text>
          </TouchableOpacity>

          {!isSettingUp && (
            <TouchableOpacity onPress={resetPin} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset PIN</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
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
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
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
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
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
  resetButton: {
    marginTop: 15,
    padding: 5,
  },
  resetText: {
    color: "#6366F1",
    fontSize: 14,
  },
});

export default PinModal;
