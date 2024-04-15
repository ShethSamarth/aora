import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

export const config = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID,
}

const {
  endpoint,
  platform,
  projectId,
  storageId,
  databaseId,
  userCollectionId,
  videoCollectionId,
} = config

const client = new Client()

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async ({ username, email, password }) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username)

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn({ email, password })

    const newUser = await databases.createDocument(databaseId, userCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.log("CREATE USER", error)
    throw new Error(error)
  }
}

export const signIn = async ({ email, password }) => {
  try {
    const session = await account.createEmailSession(email, password)

    return session
  } catch (error) {
    console.log("SIGN IN", error)
    throw new Error(error)
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    console.log("SIGN OUT", error)
    throw new Error(error)
  }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    console.log("GET ACCOUNT", error)
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(databaseId, userCollectionId, [
      Query.equal("accountId", currentAccount.$id),
    ])

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ])

    return posts.documents
  } catch (error) {
    console.log("GET ALL POSTS", error)
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ])

    return posts.documents
  } catch (error) {
    console.log("GET LATEST POSTS", error)
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ])

    if (!posts) throw new Error("Something went wrong")

    return posts.documents
  } catch (error) {
    console.log("SEARCH POSTS", error)
    throw new Error(error)
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ])

    if (!posts) throw new Error("Something went wrong")

    return posts.documents
  } catch (error) {
    console.log("USER POSTS", error)
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100)
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) {
      throw new Error("Something went wrong")
    }

    return fileUrl
  } catch (error) {
    console.log("GET FILE PREVIEW", error)
    throw new Error(error)
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.filesize,
    uri: file.uri,
  }

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset)

    const fileUrl = await getFilePreview(uploadedFile.$id, type)
    return fileUrl
  } catch (error) {
    console.log("UPLOAD FILE", error)
    throw new Error(error)
  }
}

export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId,
    })

    return newPost
  } catch (error) {
    console.log("CREATE VIDEO POST", error)
    throw new Error(error)
  }
}
