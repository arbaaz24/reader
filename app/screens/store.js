import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app'
//maybe i have to intls. maybe not(since we intls. in App.js), not usure
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default store = ({ navigation, route }) => {
    const {uid} = route.params
    const [links, setlinks] = useState([])

    const getLinks = () => {
        let data = [{"id":"1", "name":"movies"},{"id":"2", "name":"series"}, {"id":"3", "name":'books'}, {"id":"4", "name":'education'}]
        setlinks(data)
    }

    
    const goToMain = ({ item }) => navigation.navigate("main", { "topic":item.name })

    const block = ({ item }) => {
        return (
            <Pressable style={{width:80, height:20, backgroundColor:"red", marginTop:5 }}
            onPress={() => goToMain({ item })}>
                <Text> {item.name }</Text>
            </Pressable>
        )
    }
    
    useEffect(() => {
        getLinks()
        console.log("in store > useEffect() and user.uid ->", uid)
    }, [])

    const goStore = () => null //navigation.navigate("store")
    const goSubscribed = () => navigation.navigate("subscribed")
    const goMyAccount = () => navigation.navigate("myaccount")

    return (
        <SafeAreaView style={styles.container}>
                <FlatList
                    data={links}
                    keyExtractor={item => item.id}
                    renderItem={block}
                />
            <View style={{ flexDirection: "row" }}>
                <Pressable onPress={goStore} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
                <Pressable onPress={goSubscribed} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
                <Pressable onPress={goMyAccount} style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "orange" }} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "black",
        flex: 1,
        justifyContent: 'center',
        padding: 5,

    },
    img: {
        borderRadius: 25,
        height: 165,
        width: 115
    }
});