import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../components/firebaseConfig"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const app = initializeApp(firebaseConfig)

export default subscribed = ({ navigation, route }) => {
  const [links, setLinks] = useState([])
  const { uid } = route.params

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

  const unsubscribe = async (url) => {
    const temp = await AsyncStorage.getItem("subscribed" + uid)
    if (temp !== null) {
      let temp2 = JSON.parse(temp)
      //removing this url 
      temp2.splice(temp2.indexOf(url), 1)
      await AsyncStorage.setItem("subscribed" + uid, JSON.stringify(temp2))
      Alert.alert("Unsubscribed")
    }
    else console.log("cant find subscribed+uid")
  }

  const pic = ({ item }) => {
    let url = item.link
    return (
      <Pressable
        onPress={() => goToChat({ item })}
        onLongPress={() => unsubscribe(url)}>
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
  const goSubscribed = () => null //navigation.navigate("subscribed")
  const goMyAccount = () => navigation.navigate("myaccount")
  const clearAll = async () => await AsyncStorage.removeItem("subscribed" + uid)

  return (
    <>
      <View style={styles.filler} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>
            Subscribed chats
          </Text>
          <Pressable onPress={clearAll} style={styles.clear}>
            <Text>Clear all </Text>
          </Pressable>
        </View>
        {
          links.length != 0 ?
            <FlatList
              //horizontal={true}
              style={styles.flatlist}
              numColumns={3}
              data={links}
              keyExtractor={item => item.id}
              renderItem={pic}
            /> :
            <Text style={{ flex: 1 }}>
              You have no subscriptions...on this device. Enter a chat and click on subscribe button on top
            </Text>
        }

        <View style={styles.bottomTab}>
          <Pressable onPress={goStore} style={styles.tabs} >
            <Icon name="home-outline" size={30} style={styles.position} />
          </Pressable>
          <Pressable onPress={goSubscribed} style={[styles.tabs, { borderTopWidth: 2, borderTopColor: "#00ff00" }]} >
            <Icon name="content-save" size={30} style={styles.position} />
          </Pressable>
          <Pressable onPress={goMyAccount} style={[styles.tabs, { borderRightWidth: 0 }]} >
            <Icon name="account" size={30} style={styles.position} />
          </Pressable>
        </View>
      </SafeAreaView >
    </>
  )
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row"
  },
  clear: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: "red"
  },
  container: {
    alignItems: "center",
    backgroundColor: `#f0f8ff`,
    flex: 30,
    justifyContent: 'center',
    paddingTop: 0
    // marginTop: Platform.OS === "android" ? 40 : 0,
  },
  filler: {
    flex: 1,
    backgroundColor: "#ff8c00",
    justifyContent: "flex-end"
  },
  flatlist: {
    padding: 10
  },
  header: {
    backgroundColor: "#ff8c00",
    alignSelf: "stretch",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  header_text: {
    alignSelf: "center",
    color: "white",
    fontSize: 30,
    fontStyle: "italic",
    fontWeight: "bold",
    marginTop: 10
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  img: {
    borderRadius: 25,
    height: 165,
    width: 115,
  },
  position: {
    alignSelf: "center"
  },
  tabs: {
    borderRightWidth: 0.3,
    height: 40,
    flex: 1,
  }
});