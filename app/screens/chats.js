import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from 'expo-constants';
import firebase from "@firebase/app";
import "@firebase/storage";
import "@firebase/firestore";

export default chats = ({ props, route }) => {
  const { screenName } = route.params
  const screenStart = screenName + "_start"
  const [data, setData] = useState("");
  const [limit, setLimit] = useState(null);
  //to make sure we dont sotre limit twice when from top is presssed
  const [fromTop, setFromTop] = useState(false);
  // for now we are using global variable
  let x = []
  let mainString = ""
  let flatlist
  //we can write {item} here and HAVE TO use item.attr_name inside 
  const Box = ({ item }) => {
    const colors = [`#0000ff`, `#a52a2a`, `#ff1493`, `#ff8c00`, `#ff00ff`, `#006400`, `#8b008b`,`#ff0000`];
    const align = ["flex-start", "flex-end"];
    const margin = [7, 0];
    return (
      <View style={{ padding: 4 }}>
        {(parseInt(item.id) <= limit) ?
          <View style={{
            alignSelf: align[parseInt(item.id) % 2],
            borderRadius: 10,
            maxWidth: "90%",
            padding: 8,
            backgroundColor: "white",
            marginLeft: margin[parseInt(item.id) % 2],
            marginRight: margin[parseInt(item.id) % 2],
          }}>
            <Text style={{ fontWeight: "bold",  color: colors[parseInt(item.id) % 8] }}>
              {item.name}
            </Text>
            <Text style={{}}>
              {/* {item.id} */}
              {item.words}
            </Text>
          </View>
          :
          null
        }
      </View>
    );
  };
  //key is the name of the doc in firestore
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
      console.log("data stored successfully\n")
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
          let temp = value.split("=")
          for (let str of temp) {
            let temp2 = str.split(":")
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
    } catch (e) {
      console.log("No data in local storage " + e);
    }

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
        if (!fromTop) storeData(screenStart, (limit).toString());
        else setFromTop(false);
      }
    }
    return;
  }
  const restart = () => {
    storeData(screenStart, "0")
    setFromTop(true)
    goToTop()
  }

  const goToTop = () => { flatlist.scrollToOffset({ offset: 0, animated: true }) }

  const downloadData = async () => {
    const db = firebase.firestore();
    db.collection("movies").doc(screenName).get().then((doc) => {
      //here, change mainString.length !=0 to download again, else it downloads only once
      if (doc.exists && mainString.length == 0) {
        mainString = doc.data().a
        storeData(screenName, mainString)

      }
      //data might show empty as we are using async functions
      else console.log("cant find books || local data -----> " + data);
    });
  }
  useEffect(() => {
    console.log("************************ WORKING *************************");
    getData(screenName)
    downloadData()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ alignSelf: "center", backgroundColor: "yellow", fontWeight: "bold", fontSize: 20 }}>
          {screenStart}
        </Text>
        <FlatList
          data={data}
          initialNumToRender={3}
          keyExtractor={item => item.id}
          ref={ref => flatlist = ref}
          renderItem={Box}
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
          </Pressable>
          <Pressable onPressIn={goToTop}>
            <Text>Go to top</Text>
          </Pressable>
          {/*need to remove under button when in production*/}
          <Pressable
            onPressIn={restart}
            onPressOut={addData}
            style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "red" }}>
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
