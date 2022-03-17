import React, { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
// import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../components/firebaseConfig"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const app = initializeApp(firebaseConfig)

export default store = ({ navigation, route }) => {
    const { uid } = route.params
    const [links, setlinks] = useState([])

    const getLinks = () => {
        let data = [{ "description": "Enter bakstage of a movie, where characters communicate in a group chat.", "id": "1", "name": "movies" }, { "description": "Discover the density of volumes we have to offer.", "id": "2", "name": "series" }, { "description": "Love books? Awesome! cause we don’t, so we made a few changes to your favorite books and offer a smaller version in the form of a group chat.", "id": "3", "name": 'books' }, { "description": "We provide links in all areas of academics to make the subject easy and fun. Includes small tests to keep you sharp.", "id": "4", "name": 'education' }]
        setlinks(data)
    }

    const goToMain = ({ item }) => navigation.navigate("main", { "topic": item.name })

    const block = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 4 }}>
                <Pressable style={({ pressed }) => [styles.block, { backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#00bfff' }]}
                    onPress={() => goToMain({ item })}>
                    <Text style={styles.name}> {item.name}</Text>
                </Pressable>
                <Text style={styles.descrptn}>{item.description}</Text>

            </View>
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
        //alignSelf: 'stretch',
        backgroundColor: "#00bfff",
        marginTop: 5,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        padding: 5,

    },
    container: {
        alignItems: "center",
        backgroundColor: `#f0f8ff`,
        flex: 30,
        justifyContent: 'center',
        paddingTop: 0
        // marginTop: Platform.OS === "android" ? 40 : 0,

    },
    descrptn: {
        fontSize: 15,
        fontWeight: "500",
    },
    filler: {
        flex: 1,
        backgroundColor: "#90ee90",
        justifyContent: "flex-end"
    },
    flatlist: {
        padding: 10
    },
    header: {
        backgroundColor: "#90ee90",
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
        marginTop: 10
    },
    img: {
        borderRadius: 25,
        height: 165,
        width: 115
    },
    name: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "capitalize"
    },
    position: {
        alignSelf: "center"
    },
    tabs: {
        borderRightWidth: 0.3,
        height: 40,
        flex: 1,

    }
})