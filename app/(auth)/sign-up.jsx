import { useState } from "react"
import { Link, router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Alert, Image, ScrollView, Text, View } from "react-native"

import { images } from "../../constants"
import { createUser } from "../../lib/appwrite"
import { FormField } from "../../components/form-field"
import { CustomButton } from "../../components/custom-button"
import { useGlobalContext } from "../../context/global-provider"

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext()

  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createUser(form)
      setUser(response)
      setIsLogged(true)

      router.replace("/home")
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-[80vh] px-4 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[34px]" />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign up to Aora
          </Text>

          <FormField
            title="Name"
            placeholder="Samarth Sheth"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            placeholder="email@domain.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="********"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
