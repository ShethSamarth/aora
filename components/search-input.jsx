import { useState } from "react"
import { router, usePathname } from "expo-router"
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native"

import { icons } from "../constants"

export const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || "")

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search a video"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        className="h-10 w-10 -mr-2 justify-center items-center"
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across Aora"
            )

          if (pathname.startsWith("/search")) router.setParams({ query })
          else router.push(`/search/${query}`)
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}
