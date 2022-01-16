//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react';
import {  LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { chats, test_screen_1, test_screen_2, myaccount, subscribed } from "./app/screens";
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

const Stack = createNativeStackNavigator();
export default App = () => {
  LogBox.ignoreLogs(['Setting a timer']);
  useEffect(() => {
    // we can't use await inside non-async function(.getItem() still works), better call an async function from here
    console.log("************************ WORKING *************************");

  }, []);
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <Stack.Navigator
//           screenOptions={{ 
//             headerShown: false,
//             cardShadowEnabled:true,
//             gestureEnabled: true,
          
//           }}
//         >
//           <Stack.Screen name="login" component={test_screen_1} /> 
//           {/* <Stack.Screen name="store" component={test_screen_2}/>
//           <Stack.Screen name="chats" component={chats} /> */}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }



return (
  <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="test_screen_2" component={test_screen_2}/>
        <Stack.Screen name="subscribed" component={subscribed} />
        <Stack.Screen name="test_screen" component={test_screen_1}/>
        <Stack.Screen name="chats" component={chats} /> 
        <Stack.Screen name="myaccount" component={myaccount} /> 
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `#fffaf0`,
    flex: 1,
    justifyContent: 'center',
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
});
