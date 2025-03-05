jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
  };
});
