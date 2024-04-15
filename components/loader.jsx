import { View, ActivityIndicator, Platform } from "react-native"

const Loader = ({ isLoading }) => {
  const osName = Platform.OS

  if (!isLoading) return null

  return (
    <View className="absolute flex justify-center items-center w-full h-full bg-primary z-10">
      <ActivityIndicator
        animating={isLoading}
        color="#FF9C01"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  )
}

export default Loader
