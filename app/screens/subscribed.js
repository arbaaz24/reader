import React, { useEffect, useState } from 'react'
import { FlatList, Image, Pressable, ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp } from "firebase/app"
import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from "../components/firebaseConfig"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)


export default subscribed = ({ navigation, route }) => {
  const [links, setLinks] = useState([])
  const {user} = route.params

  useEffect(() => {
    console.log("in subscribed > useEffect() and user.uid ->", user.uid)
    getImages()
  }, [])

  const getImages = async () => {
    console.log("in subscribed > getImages()")
    try {
      let temp0 = await AsyncStorage.getItem("subscribed" + user.uid)
      if (temp0 !== null) {
        let temp2 = JSON.parse(temp0)
        let temp3 = []
        let index = 0
        temp2.forEach(l => {
          temp3.push({ id: index.toString(), link: l })
          index += 1
        })
        setLinks(temp3)
      }
      else {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          let temp = snap.data().subscriptions
          let temp2 = []
          let index = 0
          temp.forEach(l => {
            temp2.push({ id: index.toString(), link: l })
            index += 1
          })
          setLinks(temp2)
        }
      }
    }
    catch (e) {
      console.log(e)
    }

  }

  const goToChat = ({ item }) => {
    let s = item.link
    let t = s.split("%2F")
    // console.log(t)
    let t2 = t[1].split(".")
    let screenName = t2[0]
    navigation.navigate("chats", { screenName, url: item.link })
  }

  const pic = ({ item }) => {
    let url = item.link
    return (
      <Pressable
        onPress={() => goToChat({ item })}>
        <Image
          style={styles.img}
          source={{
            uri: url,
          }}
          resizeMode="contain"
        />
      </Pressable>
    )
  }

  const goStore = () => navigation.navigate("store")
  const goSubscribed = () => navigation.navigate("subscribed")
  const goMyAccount = () => navigation.navigate("myaccount")
  const clearAll = async () => await AsyncStorage.removeItem("subscribed" + user.uid)

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
        Subscriptions
        <Pressable onPress={clearAll} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "red" }}>
          <Text>Clear all subscriptions from local</Text>
        </Pressable>
      </Text>
      <FlatList
        //horizontal={true}
        numColumns={3}
        data={links}
        keyExtractor={item => item.id}
        renderItem={pic}
      />
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={goStore} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
        <Pressable onPress={goSubscribed} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
        <Pressable onPress={goMyAccount} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "black",
    flex: 1,
    justifyContent: 'center',
    padding: 5,

  },
  img: {
    borderRadius: 25,
    height: 165,
    width: 115,
  }
});