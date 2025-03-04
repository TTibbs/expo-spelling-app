import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import PinModal from "@/components/PinModal";
import { PinProtectionProps } from "@/types/common";
import { getData, storeData, StorageKeys } from "@/lib/storage";

const PIN_KEY = "parental_control_pin";

const PinProtection: React.FC<PinProtectionProps> = ({
  children,
  isProtected,
  onAccessGranted,
  onAccessDenied,
  setupMode = false,
}) => {
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [isPinSetup, setIsPinSetup] = useState<boolean>(false);

  useEffect(() => {
    const checkPinAndVerification = async () => {
      try {
        const [pin, verification] = await Promise.all([
          SecureStore.getItemAsync(PIN_KEY),
          getData(StorageKeys.PIN_VERIFICATION),
        ]);

        setIsPinSetup(!!pin);
        setIsPinVerified(!!verification);

        // Only show PIN modal if:
        // 1. Content is protected AND
        // 2. Either:
        //    a. We're in setup mode (explicitly setting/changing PIN) OR
        //    b. We're not verified and need to verify
        if (isProtected && (setupMode || (!verification && !!pin))) {
          setShowPinModal(true);
        }
      } catch (error) {
        console.error("Error checking PIN:", error);
      }
    };

    checkPinAndVerification();
  }, [isProtected, setupMode]);

  const handlePinSuccess = async () => {
    try {
      await storeData(StorageKeys.PIN_VERIFICATION, true);
      setIsPinVerified(true);
      setShowPinModal(false);
      onAccessGranted?.();
    } catch (error) {
      console.error("Error saving PIN verification:", error);
    }
  };

  const handleCloseModal = async () => {
    if (!isPinVerified && isProtected) {
      try {
        await storeData(StorageKeys.PIN_VERIFICATION, false);
        onAccessDenied?.();
      } catch (error) {
        console.error("Error saving PIN verification:", error);
      }
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
        setupMode={setupMode}
      />
    </View>
  );
};

export default PinProtection;
