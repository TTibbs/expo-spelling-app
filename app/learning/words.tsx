import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { wordsByCategory, wordCategories } from "@/lib/data";
import { Word, WordCategory } from "@/types/common";
import { AppImageSource } from "@/types/styling";
import { RouteParams } from "@/types/navigation";
import {
  WordCategoryItemProps,
  WordItemProps,
  WordsScreenState,
} from "@/types/spelling";

export default function WordsScreen(): JSX.Element {
  const router = useRouter();
  const [state, setState] = useState<WordsScreenState>({
    selectedCategory: wordCategories[0]?.id || "animals",
  });

  const handleCategorySelect = (categoryId: string): void => {
    setState((prevState) => ({
      ...prevState,
      selectedCategory: categoryId,
    }));
  };

  const handleWordPress = (word: Word, category: string): void => {
    router.push({
      pathname: "/word/[id]",
      params: {
        id: word.id,
        category: category,
      } as RouteParams["/word/[id]"],
    });
  };

  const renderCategoryItem = ({
    item,
  }: ListRenderItemInfo<WordCategory>): JSX.Element => (
    <WordCategoryItem
      item={item}
      isSelected={item.id === state.selectedCategory}
      onSelect={handleCategorySelect}
    />
  );

  const renderWordItem = ({ item }: ListRenderItemInfo<Word>): JSX.Element => (
    <WordItem
      item={item}
      onPress={handleWordPress}
      category={state.selectedCategory}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Fixed categories section */}
      <View>
        <FlatList
          horizontal
          data={wordCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 12,
          }}
        />
      </View>

      {/* Scrollable words section */}
      <View className="flex-1">
        <FlatList
          data={
            wordsByCategory[
              state.selectedCategory as keyof typeof wordsByCategory
            ] || []
          }
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 2,
          }}
          className="px-2"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

// Component for rendering a category item
function WordCategoryItem({
  item,
  isSelected,
  onSelect,
}: WordCategoryItemProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item.id)}
      className={`px-4 py-2.5 mr-2 rounded-full ${
        isSelected
          ? "bg-[#6366F1] border border-[#6366F1]"
          : "bg-white border border-[#E2E8F0]"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? "text-white" : "text-[#64748B]"
        }`}
      >
        {item.icon} {item.title}
      </Text>
    </TouchableOpacity>
  );
}

// Component for rendering a word item
function WordItem({ item, onPress, category }: WordItemProps): JSX.Element {
  // Type-safe image source
  const imageSource: AppImageSource = { uri: item.image };

  return (
    <TouchableOpacity
      onPress={() => onPress(item, category)}
      className="m-2 h-36 rounded-lg overflow-hidden bg-white shadow-sm"
      style={{
        width: "48%", // Fixed width to ensure consistent sizing
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
      }}
    >
      <Image source={imageSource} className="w-full h-full" />
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2.5">
        <Text className="text-white font-bold text-sm text-center">
          Tap to spell
        </Text>
      </View>
    </TouchableOpacity>
  );
}
