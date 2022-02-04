import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants'
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app'
//maybe i have to intls. maybe not(since we intls. in App.js), not usure
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default store = ({ navigation, route }) => {
    const {user} = route.params
    const storage = getStorage(app)
    const [movieLinks, setMovieLinks] = useState([])
    const [bookLinks, setBookLinks] = useState([])
    //these arrays are used to config links
    let temp = []
    let temp2 = []

    const getImages = async () => {
        let reference = ['movies', 'books']
        for (let k = 0; k < 2; k += 1) {
            let i = 0
            const listRef = ref(storage, reference[k])
            list(listRef)
                .then(res => {
                    res.items.forEach(i => getDownloadURL(i)
                        .then(res => {
                            let link = res
                            // console.log(res)
                            let id = i.toString()
                            i += 1
                            if (k == 0) temp.push({ id, link })
                            else temp2.push({ id, link })
                            if (k == 0) setMovieLinks(temp)
                            else setBookLinks(temp2)
                        }
                        )
                    )

                }
                )
                .catch(e => console.log(e))
        }
    }
    useEffect(() => {
        getImages()
        console.log("in store > useEffect() and user.uid ->", user.uid)
    }, [])

    const goToChat = ({ item }) => {
        let s = item.link
        let t = s.split("%2F")
        // console.log(t)
        let t2 = t[1].split(".")
        let screenName = t2[0]
        navigation.navigate("chats", { screenName, url: item.link })
    }

    const pic = ({ item }) => {
        let url = item.link
        return (

            <Pressable
                onPress={() => goToChat({ item })}>
                <Image
                    style={styles.img}
                    source={{
                        uri: url,
                    }}
                    resizeMode="contain"
                />
            </Pressable>
        )
    }

    const goStore = () => navigation.navigate("store")
    const goSubscribed = () => navigation.navigate("subscribed")
    const goMyAccount = () => navigation.navigate("myaccount")

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
                    Movies
                </Text>
                <FlatList
                    horizontal={true}
                    data={movieLinks}
                    keyExtractor={item => item.id}
                    renderItem={pic}
                />
                <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", marginTop: 10 }}>
                    Books
                </Text>
                <FlatList style={{}}
                    horizontal={true}
                    data={bookLinks}
                    keyExtractor={item => item.id}
                    renderItem={pic}
                />
            </ScrollView>
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