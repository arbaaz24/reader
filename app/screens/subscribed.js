import React, { useEffect, useState } from 'react'
import { FlatList, Image, Pressable, ScrollView, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native'
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
  const {uid} = route.params

  useEffect(() => {
    console.log("in subscribed > useEffect() and uid ->", uid)
    getImages()
  }, [])

  const getImages = async () => {
    console.log("in subscribed > getImages()")
    try {
      let temp0 = await AsyncStorage.getItem("subscribed" + uid)
      if (temp0 !== null) {
        let temp2 = JSON.parse(temp0)
        let temp3 = []
        let index = 0
        temp2.forEach(url => {
          temp3.push({ id: index.toString(), link: url })
          index += 1
        })
        setLinks(temp3)
      }
      else Alert.alert("You have no subscriptions...on this device")
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
    navigation.navigate("chats", { screenName, url: item.link})
  }

  const unsubscribe = async (url) => {
    const temp = await AsyncStorage.getItem("subscribed"+uid)
    if(temp !== null){
      let temp2 = JSON.parse(temp)
      //removing this url 
      temp2.splice(temp2.indexOf(url), 1)
      await AsyncStorage.setItem("subscribed"+uid, JSON.stringify(temp2))
      Alert.alert("Unsubscribed")
    }
    else console.log("cant find subscribed+uid")
  }

  const pic = ({ item }) => {
    let url = item.link
    return (
      <Pressable
        onPress={() => goToChat({ item })}
        onLongPress={() => unsubscribe(url) }>
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
  const clearAll = async () => await AsyncStorage.removeItem("subscribed" + uid)

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