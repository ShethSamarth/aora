import { Alert } from "react-native"
import { useEffect, useState } from "react"

export const useAppwrite = (fn) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fn()

      setData(response)
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => fetchData()

  return { data, isLoading, refetch }
}
