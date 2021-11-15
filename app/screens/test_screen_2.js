import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "@firebase/storage";
//maybe i have to intls. maybe not(since we intls. in App.js), not usure
import firebase from "@firebase/app";

export default test_screen_2 = ({ navigation, route }) => {
    const storage = firebase.storage()
    const [links, setLinks] = useState([])
    //this array is used to config links
    let temp = []
    const getImages = async () => {
        let i = 0
        storage.ref('movies').list()
            .then(res => {
                res.items.forEach(i => i.getDownloadURL()
                    .then(res => {
                        let link = res
                        // console.log(res)
                        let id = i.toString()
                        i += 1
                        temp.push({ id, link })
                        // setImages()
                        setLinks(temp)
                    }
                    )
                )

            }
            )
            .catch(e => console.log(e));
    }
    // const setImages = async () => {
    //     if (temp.length > 0) {
    //         setLinks(temp)
    //     }
    // }
    useEffect(() => {
        getImages()
    }, [])

    const goToChat = ({item}) => {
        let s = item.link
        let t = s.split("%2F")
        // console.log(t)
        let t2 = t[1].split(".")
        let screenName = t2[0]
        navigation.navigate("chats",{screenName})
    }
    const pic = ({ item }) => {
        let url = item.link
        return (
            <Pressable
                onPress={() => goToChat({item})}> 
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: "blue", flexDirection: "row" }}>
                <FlatList
                    horizontal={true}
                    data={links}
                    keyExtractor={item => item.id}
                    renderItem={pic}
                />
            </View>
            <View style={{ flex: 8, backgroundColor: "green", justifyContent: 'center', alignItems: "center", }} >
                <Text>
                    Testing area
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: `#fffdc3`,
        flex: 1,
        justifyContent: 'center',
        marginTop: Platform.OS === "android" ? 40 : 0,

    },
    img: {
        width: 150,
        height: 210,
    },
    pressed: {
        backgroundColor: `black`,
        borderRadius: 8,
        padding: 6
    }
});