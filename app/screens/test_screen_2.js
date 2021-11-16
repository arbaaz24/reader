import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "@firebase/storage";
//maybe i have to intls. maybe not(since we intls. in App.js), not usure
import firebase from "@firebase/app";

export default test_screen_2 = ({ navigation, route }) => {
    const storage = firebase.storage()
    const [movieLinks, setMovieLinks] = useState([])
    const [bookLinks, setBookLinks] = useState([])
    //these arrays are used to config links
    let temp = []
    let temp2 = []
    const getImages = async () => {
        let reference =['movies', 'books']
        for(let k=0;k<2;k+=1){
        let i = 0
        storage.ref(reference[k]).list()
            .then(res => {
                res.items.forEach(i => i.getDownloadURL()
                    .then(res => {
                        let link = res
                        // console.log(res)
                        let id = i.toString()
                        i += 1
                        if(k==0) temp.push({ id, link })
                        else temp2.push({ id, link })
                        // setImages()
                        if(k==0) setMovieLinks(temp)
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
            <ScrollView>
                <Text style={{fontWeight: "bold", fontSize: 20, color:"white"}}>
                    Movies
                </Text>
                <FlatList
                    horizontal={true}
                    data={movieLinks}
                    keyExtractor={item => item.id}
                    renderItem={pic}
                />
                <Text style={{fontWeight: "bold", fontSize: 20, color:"white", marginTop:10}}>
                    Books ( only not boring )
                </Text>
                <FlatList style={{}}
                    horizontal={true}
                    data={bookLinks}
                    keyExtractor={item => item.id}
                    renderItem={pic}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "black",
        flex: 1,
        justifyContent: 'center',
        marginTop: Platform.OS === "android" ? 40 : 0,
        padding:5,

    },
    img: {
        borderRadius: 25,
        height: 190,
        width: 145,
    }
});