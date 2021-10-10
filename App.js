//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react';
import { Button, FlatList, LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { chats, test_screen_1, test_screen_2 } from "./app/screens";
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
  console.log("working before useEffect")
  useEffect(() => {
    // we can't use await inside non-async function(.getItem() still works), better call an async function from here
    console.log("************************ WORKING *************************");

  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ 
            headerShown: false,
            cardShadowEnabled:true,
            gestureEnabled: true,
          
          }}
        >
          <Stack.Screen name="chats" component={chats} />
          <Stack.Screen name="screen_2" component={test_screen_2}/>
          <Stack.Screen name="screen_1" component={test_screen_1} />
        </Stack.Navigator>
      </NavigationContainer>
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
