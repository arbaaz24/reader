//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react';
import { Button, FlatList, LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import firebase from "@firebase/app";
import "@firebase/storage";
import "@firebase/firestore";
//you have to hide these vals., see the liked tweet
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

  //to make sure we dont sotre limit twice when from top is presssed
  const [fromTop, setFromTop] = useState(false);
  //color palette for text boxes
  // const colors = [`#90ee90`, `#e0ffff`, `#7fffd4`, `#f0f8ff`, `#afeeee`, `#00ff7f`, `#40e0d0`, `#ffc0cb`];
  // for now we are using global variable
  let x = [];
  let flatlist;
  //we can write {item} here and HAVE TO use item.attr_name inside 
  const Box = ({ item }) => {
    const colors = [`#90ee90`, `#e0ffff`, `#7fffd4`, `#f0f8ff`, `#afeeee`, `#00ff7f`, `#40e0d0`, `#ffc0cb`];
    const align = ["flex-start", "flex-end"];
    const margin = [7, 0];
    return (
        <View style={{ padding: 4 }}>
            {(parseInt(item.id) <= limit) ? //using ternary inside a ternary oprtr
                <View style={{ alignSelf: align[parseInt(item.id) % 2], maxWidth: "90%", backgroundColor: colors[parseInt(item.id) % 8], borderRadius: 10, marginLeft: margin[parseInt(item.id) % 2], marginRight: margin[parseInt(item.id) % 2], padding: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {item.name}
                    </Text>
                    <Text >
                        {item.id}
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
            let id = num.toString();
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
       storeData("harrypotter", JSON.stringify(x));
        
      }
      //data might show empty as we are using async functions
      //else console.log("cant find books || local data -----> " + data);
    });
    //work in progress for cloud storage, accesible by both, google storage and firebase storage
    const storage = firebase.storage();
  }, []);

  const restart = () => {
    storeData("harrypotter_start", "5");
    setFromTop(true);
    goToTop();
  }
  const goToTop = () => {flatlist.scrollToOffset({ offset: 0, animated: true })}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ alignSelf: "center", backgroundColor: "yellow", fontWeight: "bold", fontSize: 20 }}>
          Harry Potter and the sorcerer's stone
        </Text>
        <FlatList
          data={data}
          initialNumToRender={3}
          keyExtractor={item => item.id}
          ref={ref => flatlist = ref}
          renderItem={Box}
        />
        <View style={{ justifyContent: "center", flexDirection: "row", padding: 30 }}>
          <Button title="Press x2"
            onPress={addData} />
          <Button title="restart" onPress={restart} />
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
