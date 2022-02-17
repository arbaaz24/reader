import React, { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable } from "react-native"
import { doc, getFirestore, collection, getDocs, query, getDoc, setDoc } from "firebase/firestore"
import { firebaseConfig } from "../components/firebaseConfig"
import { initializeApp } from "firebase/app"

export default main = ({ navigation, route }) => {
  const { topic } = route.params
  const [data, setData] = useState([])
  let temp = []
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const getChats = async () => {
    let snap = await getDoc(doc(db, topic, "all"))
    setData(snap.get("a"))
  }

  useEffect(() => {
    console.log("in main > route.params.topic = ", topic)
    getChats()
  }, [])

  const block = ({ item }) => {
    return (
        <Pressable style={{width:80, height:20, backgroundColor:"red", marginTop:5 }} 
        onPress={() => navigation.navigate("chats", {screenName:item.name})}>
            <Text> {item.name}</Text>
        </Pressable>
    )
}

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={block}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `black`,
    flex: 1,
    justifyContent: 'center',
    //marginTop: Platform.OS === "android" ? 40 : 0,
  },
})
