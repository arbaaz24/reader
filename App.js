//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react';
import { Button, FlatList, LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

//u hv to hide these vals., see the liked tweet
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: Constants.manifest.extra.apiKey,
    authDomain: Constants.manifest.extra.authDomain,
    databaseURL: Constants.manifest.extra.datatbaseURL,
    projectId: Constants.manifest.extra.projectId,
    storageBucket: Constants.manifest.extra.storageBucket,
    messagingSenderId: Constants.manifest.extra.messagingSenderId,
    appId: Constants.manifest.extra.appId,
    measurementId: Constants.manifest.extra.measurementId
  });
}

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(null);
  //to mamke sure we dont sotre limit twice when from top is presssed
  const [fromTop, setFromTop] = useState(false);
  //color palette for text boxes
  const colors = [`#90ee90`, `#e0ffff`, `#7fffd4`, `#f0f8ff`, `#afeeee`, `#00ff7f`, `#40e0d0`, `#ffc0cb`];
  // for now we are using global variable
  let x = [];

  //we can write {item} here and HAVE TO use item.attr_name inside 
  const Box = ({ item }) => (
    <View style={{ padding: 4 }}>
      {(parseInt(item.id) <= limit) ? //using ternary inside a ternary oprtr.
        (parseInt(item.id) % 2 == 0) ?
          <View style={{ alignSelf: "flex-start", maxWidth: "90%", backgroundColor: colors[parseInt(item.id) % 8], borderRadius: 10, marginLeft: 7, padding: 10 }}>
            <Text style={{ fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text >
              {item.id}
              {item.words}
            </Text>
          </View>
          :
          <View style={{ alignSelf: "flex-end", maxWidth: "90%", backgroundColor: colors[parseInt(item.id) % 8], borderRadius: 10, marginRight: 7, padding: 10 }}>
            <Text style={{ fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text>
              {item.id}
              {item.words}
            </Text>
          </View>
        :
        null
      }
    </View>
  )

  //key is the name of the doc in firestore
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("data stored successfully\n");
    } catch (e) {
      console.log("error storing data" + e);
    }
  }
  const getData = async (key) => {
    let value = [];
    console.log("in getData()");
    try {
      //getting data (in JSON) from  local storage
      value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        //console.log(JSON.parse(value));
        let num = 0;
        for (let str of JSON.parse(value)) {
          //= is our delimiter
          let temp = str.split("=");
          for (let str of temp) {
            let temp2 = str.split(":");
            let name = temp2[0];
            let words = temp2[1];
            num += 1;
            id = num.toString();
            x.push({
              id,
              name,
              words
            });
          }
          setData(x);
        }
        //console.log("x looks like this ", x);
      }
    } catch (e) {
      console.log("No data in local storage " + e);
    }

  }

  const addData = async () => {
    console.log("in add Data");
    try {
      let n = await AsyncStorage.getItem("harrypotter_start");
      if (n != null) setLimit(parseInt(n) + 5);
      console.log("limit -> " + limit);
    }
    catch (e) {
      console.log("data not found " + e);
    }
    finally {
      if (limit != null) {
        console.log("storing limit");
        if (!fromTop) storeData("harrypotter_start", (limit).toString());
        else setFromTop(false);
      }
    }
    return;
  }

  useEffect(() => {
    // we can't use await inside non-async function(.getItem() still works), better call an async function from here
    console.log("************************ WORKING *************************");
    const db = firebase.firestore();
    getData("harrypotter");
    db.collection("books").doc("harrypotter").get().then((doc) => {
      if (doc.exists && x.length == 0) {
        x = doc.data().a;
        if (!fromTop) storeData("harrypotter", JSON.stringify(x));
        else setFromTop(false);
      }
      //data might show empty as we are using async functions
      //else console.log("cant find books || local data -----> " + data);
    });
  }, []);

  const restart = () => {
    storeData("harrypotter_start", "5");
    setFromTop(true);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={Box}
        />
        <View>
          <Button title="Press x2"
            onPress={addData} />
          <Button title="from start ?"
            onPress={restart}
            color={"red"} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
});
