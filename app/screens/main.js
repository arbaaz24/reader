import React, { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View, FlatList, Platform, Pressable } from "react-native"
import { doc, getFirestore, getDoc } from "firebase/firestore"
import { firebaseConfig } from "../components/firebaseConfig"
import { initializeApp } from "firebase/app"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default main = ({ navigation, route }) => {
  const { topic } = route.params
  const [data, setData] = useState([])
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
      <Pressable style={styles.block}
        onPress={() => navigation.navigate("chats", { screenName: item.name, topic })}>
        <Text> {item.name}</Text>
      </Pressable>
    )
  }

  return (
    <>
      <View style={styles.filler} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="keyboard-backspace" size={40} style={styles.back} />
          </Pressable>
          <Text style={styles.header_text}> {topic} </Text>
        </View>
        <FlatList
        style={styles.flatlist}
          data={data}
          keyExtractor={item => item.id}
          renderItem={block}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  back: {
    backgroundColor:"#7fffd4",
    borderWidth:1,
    marginTop:10,
    borderBottomLeftRadius:10
  },
  block: {
    alignSelf: 'stretch',
    backgroundColor: "red",
    marginTop: 5,
    borderRadius: 18,
    padding: 9
  },
  container: {
    alignItems: "center",
    backgroundColor: `#f0f8ff`,
    flex: 30,
    justifyContent: 'center',
    paddingTop: 0,
    // marginTop: Platform.OS === "android" ? 40 : 0,
  },
  filler: {
    flex: 1,
    backgroundColor: "#ffa500",
    justifyContent: "flex-end"
  },
  flatlist:{
    padding:10
  },
  header: {
    backgroundColor: "#ffa500",
    alignSelf: "stretch",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
  },
  header_text: {
    alignSelf: "center",
    color: "white",
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "bold",
    marginLeft:20,
    textTransform:"capitalize"
  }
})
