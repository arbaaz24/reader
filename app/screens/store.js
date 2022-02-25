import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
// import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../components/firebaseConfig"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const app = initializeApp(firebaseConfig)

export default store = ({ navigation, route }) => {
    const { uid } = route.params
    const [links, setlinks] = useState([])

    const getLinks = () => {
        let data = [{ "description": "Enter bakstage of a movie, where characters communicate in a group chat.", "id": "1", "name": "movies" }, { "description": "Discover the density of Volumes we have to offer.", "id": "2", "name": "series" }, { "description": "Love books? Awesome! cause we don’t, so we made a few changes to your favorite books and offer a smaller version in the form of a group chat.", "id": "3", "name": 'books' }, { "description": "We provide links in all areas of academics to make the subject more interesting. Includes small tests b/w each chat to keep you sharp. Meet characters on the way that are always there to make things fun.", "id": "4", "name": 'education' }]
        setlinks(data)
    }

    const goToMain = ({ item }) => navigation.navigate("main", { "topic": item.name })

    const block = ({ item }) => {
        return (
            <Pressable style={styles.block}
                onPress={() => goToMain({ item })}>
                <Text style={{ fontSize: 20, textTransform: "capitalize" }}> {item.name}</Text>
                <Text sty>{item.description}</Text>
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
        <>
            <View style={styles.filler} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_text}>
                        Store
                    </Text>
                </View>
                <FlatList
                    data={links}
                    keyExtractor={item => item.id}
                    renderItem={block}
                    style={styles.flatlist}
                />
                <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={goStore} style={[styles.tabs, { borderTopWidth: 2, borderTopColor: "#00ff00" }]} >
                        <Icon name="home-outline" size={30} style={styles.position} />
                    </Pressable>
                    <Pressable onPress={goSubscribed} style={styles.tabs} >
                        <Icon name="content-save" size={30} style={{ alignSelf: "center" }} />
                    </Pressable>
                    <Pressable onPress={goMyAccount} style={[styles.tabs, { borderRightWidth: 0 }]} >
                        <Icon name="account" size={30} style={{ alignSelf: "center" }} />
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    block: {
        alignSelf: 'stretch',
        backgroundColor: "red",
        marginTop: 5,
        borderRadius: 18,
        padding: 9,

    },
    container: {
        alignItems: "center",
        backgroundColor: `#f0f8ff`,
        flex: 30,
        justifyContent: 'center',
        paddingTop: 0
        // marginTop: Platform.OS === "android" ? 40 : 0,

    },
    filler: {
        flex: 1,
        backgroundColor: "#ff8c00",
        justifyContent: "flex-end"
    },
    flatlist: {
        padding: 10
    },
    header: {
        backgroundColor: "#ff8c00",
        alignSelf: "stretch",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    header_text: {
        alignSelf: "center",
        color: "white",
        fontSize: 30,
        fontStyle: "italic",
        fontWeight: "bold",
        marginTop:10 
    },
    img: {
        borderRadius: 25,
        height: 165,
        width: 115
    },
    position: {
        alignSelf: "center"
    },
    tabs: {
        borderRightWidth: 0.3,
        height: 40,
        flex: 1,

    }
});