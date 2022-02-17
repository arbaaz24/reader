//this edit is only visible on slave branch
import React, { useEffect, useState } from 'react'
import { LogBox, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { chats, main, store, myaccount, subscribed, login } from "./app/screens"
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, query } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { firebaseConfig } from "./app/components/firebaseConfig"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const Stack = createNativeStackNavigator()
//const db = getFirestore(app)

export default App = () => {
  LogBox.ignoreLogs(['Setting a timer'])
  const [uid, setUser] = useState(null)

  const getUserDoc = async (userData) => {
    // we aren't creating doc for user , to reduce R/W, maybe in te future..
    // const snap = await getDoc(doc(db, 'users', userData.uid))
    // if (snap.exists()) {
    //   //console.log("in App.js , snap-->", snap.data())
    //   setUser(snap.data())
    // }
    setUser(userData.uid)
  }

  useEffect(() => {
    console.log("************************ WORKING *************************")
    onAuthStateChanged(auth, userData => {
      if (userData)
        if (userData.emailVerified) getUserDoc(userData)
        else alert("Please complete verification sent to your email.")
    })
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardShadowEnabled: true, gestureEnabled: true }}>
          {uid ? //since userData has nested objects, for now we are only passing the uid
            <>
              <Stack.Screen name="store" component={store} initialParams={{uid}} />
              <Stack.Screen name="main" component={main} />
              <Stack.Screen name="subscribed" component={subscribed} initialParams={{uid}} />
              <Stack.Screen name="chats" component={chats} initialParams={{uid}} />
              <Stack.Screen name="myaccount" component={myaccount} initialParams={{uid}} />
            </>
            :
            <Stack.Screen name="login" component={login} />
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
