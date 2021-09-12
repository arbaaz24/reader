//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, LogBox, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

//u hv to hide these vals., see the liked tweet
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyC9fNx3sW9G8rxKfpvMCnRP8AxQ_I4d510",
    authDomain: "learning-29ccf.firebaseapp.com",
    databaseURL: "https://learning-29ccf-default-rtdb.firebaseio.com",
    projectId: "learning-29ccf",
    storageBucket: "learning-29ccf.appspot.com",
    messagingSenderId: "155925228676",
    appId: "1:155925228676:web:95e95ebb56e457500c26d1",
    measurementId: "G-Q8V5JY766T"
  });
}


export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  const [data, setData] = useState([]);
  //color palette for text boxes
  const colors =[`#90ee90`, `#e0ffff`, `#7fffd4`, `#f0f8ff`, `#afeeee`, `#00ff7f`, `#40e0d0`, `#ffc0cb`];
  // for now we are using global variable
  let x = [];

  //key is the name of the doc in firestore
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("\ndata stored successfully\n");
    } catch (e) {
      console.log("error storing data" + e);
    }
  }
  const getData = async (key) => {
    let value = [];
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
        console.log("data looks like this ", data);
      }
    } catch (e) {
      console.log("No data in local storage " + e);
    }

  }

  useEffect(() => {
    // we can't use await inside non-async function(.getItem() still works), better call an async function from here
    console.log("*****************************WORKING*************************");
    const db = firebase.firestore();
    getData("harrypotter");
    db.collection("books").doc("harrypotter").get().then((doc) => {
      if (doc.exists && x.length == 0) {
        x = doc.data().a;
        storeData("harrypotter", JSON.stringify(x));
      }
      //data might show empty as we are using async functions
      else console.log("cant find books || local data -----> " + data);
    });
  }, []);

  const Elipse = ({ id, name, words }) => (
    <View style={{ padding: 4 }}>
      {parseInt(id) % 2 == 0 ?
        <View style={{ alignSelf: "flex-start", maxWidth: "90%", backgroundColor: colors[parseInt(id)%8], borderRadius:10, marginLeft:7, padding:10 }}>
            <Text style={{ fontWeight: "bold" }}>
            {name}
           </Text>
          <Text >
            {id}
            {words}
          </Text>
        </View>
        :
        <View style={{ alignSelf: "flex-end", maxWidth: "90%", backgroundColor: colors[parseInt(id)%8], borderRadius:10, marginRight:7, padding:10 }}>
          <Text style={{ fontWeight: "bold" }}>
            {name}
           </Text>
          <Text>
            {id}
            {words}
          </Text>
        </View>
      }
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <Elipse
              name={item.name}
              words={item.words}
              id={item.id}
            />}
        />
        
      <View>
        <Button title="press to load more texts"/>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex:1,
    justifyContent: 'center',
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
});
