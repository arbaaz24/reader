//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react'
import {  LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { chats, main, store, myaccount, subscribed } from "./app/screens"
import Constants from 'expo-constants'
import firebase from "@firebase/app"
import "@firebase/storage"
import "@firebase/firestore"
import "@firebase/auth"

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
  })
}

const Stack = createNativeStackNavigator()
export default App = () => {
  // usePreventScreenCapture()
  LogBox.ignoreLogs(['Setting a timer'])
  const [user, setUser] = useState(null)

useEffect(() => {
  console.log("************************ WORKING *************************")
  const usersRef = firebase.firestore().collection("users")
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      usersRef
        .doc(user.uid)
        .get()
        .then((document) => {
          const userData = document.data()
          setLoading(false)
          setUser(userData)
        })
        .catch((error) => {
          console.log("error in useEffect() of App.js")
          //setLoading(false)
        })
    }
  })
}, [])


return (
  <SafeAreaView style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardShadowEnabled:true, gestureEnabled: true}}>
        {!user ?
        <>
        <Stack.Screen name="main" component={main}/>
        <Stack.Screen name="store" component={store}/>
        <Stack.Screen name="subscribed" component={subscribed} />
        <Stack.Screen name="myaccount" component={myaccount} /> 
        <Stack.Screen name="chats" component={chats} /> 
        </>
        :
        <>
        <Stack.Screen name="myaccount" component={myaccount} />
        </>
        }
         
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `black`,
    flex: 1,
    justifyContent: 'center',
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
})
