import React, { useCallback, useEffect, useState } from "react"
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from 'firebase/app'
import { getAuth, signOut } from "firebase/auth"
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default myaccount = ({ navigation, route }) => {
    const auth = getAuth(app)
    const {user} = route.params
    const logOut = async () => {
        await signOut(auth)
        alert("Please close the app to fully log out..")

    }

    useEffect(() => {
        console.log("in myaccount > useEffect and user.uid ->", user.uid)
    },[])

    const goStore = () => navigation.navigate("store")
    const goSubscribed = () => navigation.navigate("subscribed")
    const goMyAccount = () => navigation.navigate("myaccount")

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:"black" }} >
            <Text style={{color:"white"}}>
                my account
            </Text>
            <Pressable style={{ borderRadius: 5, height: 60, width: 60, backgroundColor: "red" }}
                onPress={logOut}>
                <Text style={{ alignSelf: "center" }}>Sign Out</Text>
            </Pressable>
            <View style={{ flexDirection:"row", flex:2, alignItems:"flex-end", justifyContent:"center"  }}>
                <Pressable onPress={goStore} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
                <Pressable onPress={goSubscribed} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
                <Pressable onPress={goMyAccount} style={{  borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
            </View>
        </SafeAreaView >
    )
}