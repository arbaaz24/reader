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
        temp2.forEach(name => {
          temp3.push({ id: index.toString(), name })
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
    let screenName = item.name.split(' ').join('').toLowerCase()
    navigation.navigate("chats", { screenName, "name": item.name })
  }

  const unsubscribe = async (name) => {
    const temp = await AsyncStorage.getItem("subscribed" + uid)
    if (temp !== null) {
      let temp2 = JSON.parse(temp)
      //removing this name 
      temp2.splice(temp2.indexOf(name), 1)
      await AsyncStorage.setItem("subscribed" + uid, JSON.stringify(temp2))
      Alert.alert("Unsubscribed")
    }
    else console.log("cant find subscribed+uid")
  }

  const block = ({ item }) => {
    return (
      <Pressable style={({ pressed }) => [
        styles.block,
        {
          backgroundColor: pressed
            ? 'rgb(210, 230, 255)'
            : 'white'
        }
      ]}
        onPress={() => goToChat({ item })}
        onLongPress={() => unsubscribe(item.name)}>
        <Text style={styles.name}> {item.name}</Text>
        {/* <Text style={styles.name2}>Author/Screenplay : {item.author} </Text> */}
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
        </View>
        {
          links.length != 0 ?
            <>
              {/* <Pressable onPress={clearAll} style={styles.clear}>
                <Text style={styles.buttonText}>Clear all </Text>
              </Pressable> */}
              <Text style={{ fontWeight: "bold", color: "#483d8b", padding:5 }}>Long press a chat to Unsubscribe</Text>
              <FlatList
                style={styles.flatlist}
                data={links}
                keyExtractor={item => item.id}
                renderItem={block}
              />
            </> :
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#483d8b", flex: 1, padding: 30 }}>
              You have no subscriptions on this device. Enter a chat and click the
              <Pressable style={{
                alignSelf: "center",
                borderRadius: 10,
                backgroundColor: "yellow",
                padding: 5
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>subscribe</Text>
              </Pressable> button.
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
  block: {
    alignSelf: 'stretch',
    flex: 1,
    marginTop: 5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 9
  },
  bottomTab: {
    flexDirection: "row"
  },
  buttonText: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  clear: {
    borderRadius: 20,
    backgroundColor: "red",
    marginTop: 5,
    padding: 5,
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
    alignContent: "space-around",
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
  name: {
    fontWeight: "bold",
    fontSize: 17
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