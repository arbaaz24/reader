import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

// import Constants from 'expo-constants';
import firebase from "@firebase/app";
import "@firebase/storage";
import "@firebase/firestore";
import Box from "../components/Box.js"
export default chats = ({ navigation, props, route }) => {
  //prevents screen shots
 
  const { screenName } = route.params
  const screenStart = screenName + "_start"
  const [data, setData] = useState("")
  const [limit, setLimit] = useState(null)
  //to make sure we dont sotre limit twice when from top is presssed
  const [fromTop, setFromTop] = useState(false);
  // for now we are using global variable
  let x = []
  let mainString = ""
  let flatlist
  

  //key is the name of the doc in firestore
  const storeData = async (key, value, location) => {
    try {
      await AsyncStorage.setItem(key, value)
      console.log("data stored successfully from function " + location +"\n")
    } catch (e) {
      console.log("error storing data" + e)
    }
  }
  const getData = async (key) => {
    let value
    console.log("in getData()")
    try {
      //getting data (in JSON) from  local storage
      //can we use AsynStorage.getItem().then() ??
      value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
        // console.log(value);
        let num = 0
          //= is our delimiter
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
      else{//here downloadData() because we want to download only if not available locally
        downloadData()
      } 
    } catch (e) {
      console.log("No data in local storage " + e);
    }// finally{
    //   x=[]
    // }

  }
  const addData = async () => {
    console.log("in add Data");
    try {
      let n = await AsyncStorage.getItem(screenStart);
      if (n != null) setLimit(parseInt(n) + 5);
      console.log("limit -> " + limit);
    }
    catch (e) {
      console.log("data not found " + e);
    }
    finally {
      if (limit != null) {
        if (!fromTop) storeData(screenStart, (limit).toString(), "addData()");
        else setFromTop(false);
      }
    }
    return;
  }
  const restart = () => {
    storeData(screenStart, "0", "restart()")
    setFromTop(true)
    
    goToTop()
  }

  const goToTop = () => { flatlist.scrollToOffset({ offset: 0, animated: true }) }
  

  const downloadData = async () => {
    console.log("in downloadData()\n")
    const db = firebase.firestore();
    db.collection("movies").doc(screenName).get().then((doc) => {
      //here, change mainString.length !=0 to download again, else it downloads only once
      if (doc.exists && mainString.length == 0) {
        mainString = doc.data().a
        storeData(screenName, mainString, "downloadData()")
        getData(screenName)

      }
      //data might show empty as we are using async functions
      else console.log("cant find books || local data -----> " + data);
    });
  }
  useEffect(() => {
    console.log("************************ WORKING *************************");
    getData(screenName)
    //line under should be removed in production
    //downloadData()
  }, [])

  const render =({item})=>{
    return(
      <Box limit={limit} item={item} />
    )
  }

  const removeData = () =>{
    AsyncStorage.removeItem(screenName)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ alignSelf: "center", backgroundColor: "yellow", fontWeight: "bold", fontSize: 20 }}>
          {screenStart}
        </Text>
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
      <Icon name="arrow-down" size={30} style={{alignSelf:"center"}}  />
      </Pressable>
      
          <Pressable onPressIn={goToTop}
          style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }}>
            <Icon name="arrow-up" size={30} style={{alignSelf:"center"}}  />
          </Pressable>
          {/*need to remove under button when in production*/}
          <Pressable
            onPressIn={restart}
            onPressOut={addData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "red" }} >
              <IconMaterial name="delete" size={30} style={{alignSelf:"center"}}  />
              </Pressable>
          <Pressable
            onPressIn={removeData}
            onPressOut={removeData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "blue" }} >
              <Icon name="md-refresh-sharp" size={30} style={{alignSelf:"center"}}  />
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
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
});
