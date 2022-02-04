import React, { useEffect, useState } from 'react'
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from 'react-native-vector-icons/Ionicons'
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from "firebase/app"
import Box from "../components/Box.js"
import { getFirestore, getDoc, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { firebaseConfig } from "../components/firebaseConfig"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default chats = ({ navigation, route }) => {
  const { screenName, url, user } = route.params //url is the GCloud storage url for clicked image
  const screenStart = screenName + "_start"
  const [data, setData] = useState("")
  const [limit, setLimit] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  //to make sure we dont sotre limit twice when from top is presssed
  const [fromTop, setFromTop] = useState(false);
  // for now we are using global variable
  let x = []
  let mainString = ""
  let flatlist

  //key is the name of the doc in firestore
  const getData = async (key) => {
    let value
    console.log("in getData()")
    try {
      //getting data (in JSON) from  local storage
      value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
        // console.log(value);
        let num = 0
        //^ is our delimiter
        let temp = value.split('^')
        for (let str of temp) {
          let temp2 = str.split(">")
          let name = temp2[0]
          let words = temp2[1]
          let id = num.toString()
          num += 1
          x.push({
            id,
            name,
            words
          });
          setData(x);
        }
        // console.log("x looks like this ", x);
      }
      else {//here downloadData() because we want to download only if not available locally
        downloadData()
      }
    } catch (e) {
      console.log("No data in local storage " + e);
    }
  }
  
  const storeData = async (key, value, location) => {
    try {
      await AsyncStorage.setItem(key, value)
      console.log("data stored successfully from function " + location + "\n")
    } catch (e) {
      console.log("error storing data" + e)
    }
  }

  const addData = async () => {
    console.log("in addData()");

      let n = await AsyncStorage.getItem(screenStart);
      if (n != null) {
      setLimit(parseInt(n) + 5)
      if (!fromTop) storeData(screenStart, (limit === null ? "5" :(limit).toString()), "addData()");
      else setFromTop(false);
    }
    else storeData(screenStart, "0", "restart()")
    console.log("limit -> " + limit);
    
    return;
  }

  const restart = async () => {
    storeData(screenStart, "0", "restart()")
    setFromTop(true)
    goToTop()
  }

  const goToTop = () =>  flatlist.scrollToOffset({ offset: 0, animated: true }) 

  const downloadData = async () => {
    console.log("in downloadData()\n")
    const db = getFirestore(app)
    const snap = await getDoc(doc(db, "movies", screenName))
    //here, change mainString.length !=0 to download again, else it downloads only once
    if (snap.exists() && mainString.length == 0) {
      mainString = snap.data().a
      storeData(screenName, mainString, "downloadData()")
      getData(screenName)
    }
    //data might show empty as we are using async functions
    else console.log("cant find books || local data -----> " + data)
  }

  useEffect(() => {
    console.log("in chats > useEffects and user.uid -> ", user.uid, "screen path is ->", route.params.path)
    getData(screenName)
    
  }, [])

  const render = ({ item }) => {
    return (
      <Box limit={limit} item={item} />
    )
  }

  const removeData = async () => {
    await AsyncStorage.removeItem(screenName)
  }

  const subscribe = async () => {
    console.log("in subscribe() and user.uid -->", user.uid)
    updateDoc(doc(db, 'users', user.uid), { subscriptions: arrayUnion(url) })
    setSubscribed(true)
    let links = await AsyncStorage.getItem("subscribed" + user.uid)
    if (links === null) {
      await AsyncStorage.setItem("subscribed" + user.uid, JSON.stringify([url]))
    }
    else {
      let links2 = JSON.parse(links)
      //before pushing we have to make sure that the url dosen't already exist, includes("arg here is case sensitive")
      if(links2.includes(url)) alert("Already subscribed")
      else links2.push(url)
      await AsyncStorage.setItem("subscribed" + user.uid, JSON.stringify(links2))
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ alignSelf: "center", backgroundColor: "yellow", fontWeight: "bold", fontSize: 20, flexDirection: "row" }}>
          <Text>{screenStart}</Text>
          <Pressable style={{ borderRadius: 5, height: 40, width: 40, backgroundColor: subscribed ? "blue" : "red" }}
            onPress={subscribe}>
            <Text>{subscribed ? "Unsubscribe" : "subscribe"}</Text>
          </Pressable>
        </View>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          ref={ref => flatlist = ref}
          renderItem={render}
        />
        <View style={{
          padding: 0,
          justifyContent: "center",
          flexDirection: "row",
        }}>
          <Pressable
            onPressIn={addData}
            onPressOut={addData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "green" }}>
            <Icon name="arrow-down" size={30} style={{ alignSelf: "center" }} />
          </Pressable>

          <Pressable onPressIn={goToTop}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }}>
            <Icon name="arrow-up" size={30} style={{ alignSelf: "center" }} />
          </Pressable>
          {/*need to remove under button when in production*/}
          <Pressable
            onPressIn={restart}
            onPressOut={addData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "red" }} >
            <IconMaterial name="delete" size={30} style={{ alignSelf: "center" }} />
          </Pressable>
          <Pressable
            onPressIn={removeData}
            onPressOut={removeData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "blue" }} >
            <Icon name="md-refresh-sharp" size={30} style={{ alignSelf: "center" }} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: `#fffaf0`,
    flex: 1,
    justifyContent: 'center',
    //marginTop: Platform.OS === "android" ? 40 : 0,
  },
});
