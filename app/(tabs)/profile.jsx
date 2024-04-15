import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { FlatList, Image, TouchableOpacity, View } from "react-native"

import { icons } from "../../constants"
import { InfoBox } from "../../components/info-box"
import { useAppwrite } from "../../lib/useAppwrite"
import { VideoCard } from "../../components/video-card"
import { EmptyState } from "../../components/empty-state"
import { getUserPosts, signOut } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/global-provider"

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext()
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id))

  const handleLogout = async () => {
    await signOut()

    router.replace("/sign-in")
    setUser(null)
    setIsLogged(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this profile" />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity onPress={handleLogout} className="flex w-full items-end mb-10">
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox title={user?.username} containerStyles="mt-5" titleStyles="text-lg" />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox title="7k" subtitle="Followers" titleStyles="text-xl" />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Profile