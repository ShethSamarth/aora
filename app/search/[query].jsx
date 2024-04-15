import { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { FlatList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { searchPosts } from "../../lib/appwrite"
import { useAppwrite } from "../../lib/useAppwrite"
import { VideoCard } from "../../components/video-card"
import { EmptyState } from "../../components/empty-state"
import { SearchInput } from "../../components/search-input"

const Search = () => {
  const { query } = useLocalSearchParams()

  const { data: posts, refetch } = useAppwrite(() => searchPosts(query))

  useEffect(() => {
    refetch()
  }, [query])

  console.log(posts)

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">Search Results</Text>
              <Text className="text-2xl font-psemibold text-white mt-1">{query}</Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this search query" />
        )}
      />
    </SafeAreaView>
  )
}

export default Search