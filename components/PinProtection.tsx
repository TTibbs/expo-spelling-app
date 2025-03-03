import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import PinModal from "@/components/PinModal";
import { PinProtectionProps } from "@/types/common";

const PIN_KEY = "parental_control_pin";

const PinProtection: React.FC<PinProtectionProps> = ({
  children,
  isProtected,
  onAccessGranted,
  onAccessDenied,
}) => {
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [isPinSetup, setIsPinSetup] = useState<boolean>(false);

  useEffect(() => {
    const checkPinExists = async () => {
      try {
        const pin = await SecureStore.getItemAsync(PIN_KEY);
        setIsPinSetup(!!pin);

        if (isProtected && !isPinVerified) {
          setShowPinModal(true);
        }
      } catch (error) {
        console.error("Error checking PIN:", error);
      }
    };

    checkPinExists();
  }, [isProtected, isPinVerified]);

  const handlePinSuccess = () => {
    setIsPinVerified(true);
    setShowPinModal(false);
    onAccessGranted?.();
  };

  const handleCloseModal = () => {
    if (!isPinVerified && isProtected) {
      // If we close without verifying, we should navigate back or prevent access
      onAccessDenied?.();
    }
    setShowPinModal(false);
  };

  if (!isProtected || isPinVerified) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1 }}>
      <PinModal
        isVisible={showPinModal}
        onClose={handleCloseModal}
        onSuccess={handlePinSuccess}
        setupMode={!isPinSetup}
      />
    </View>
  );
};

export default PinProtection;
