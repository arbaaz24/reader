import React, { useEffect } from "react"
import { Alert, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from 'firebase/app'
import { getAuth, signOut } from "firebase/auth"
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default myaccount = ({ navigation, route }) => {
    const auth = getAuth(app)
    const { uid } = route.params
    const logOut = async () => {
        await signOut(auth)
        Alert.alert("Please close the app to fully log out..")
    }

    useEffect(() => {
        console.log("in myaccount > useEffect and uid ->", uid)
    }, [])

    const goStore = () => navigation.navigate("store")
    const goSubscribed = () => navigation.navigate("subscribed")
    const goMyAccount = () => navigation.navigate("myaccount")

    return (
        <>
            <View style={styles.filler} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_text}>
                        My Account
                    </Text>
                    <Pressable style={styles.logout}
                        onPress={logOut}>
                        <Text style={styles.position}>Sign Out</Text>
                    </Pressable>
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={styles.bottomTab}>
                    <Pressable onPress={goStore} style={styles.tabs} >
                        <Icon name="home-outline" size={30} style={styles.position} />
                    </Pressable>
                    <Pressable onPress={goSubscribed} style={styles.tabs} >
                        <Icon name="content-save" size={30} style={styles.position} />
                    </Pressable>
                    <Pressable onPress={goMyAccount} style={[styles.tabs, { borderTopWidth: 2, borderTopColor: "#00ff00", borderRightWidth: 0 }]} >
                        <Icon name="account" size={30} style={styles.position} />
                    </Pressable>
                </View>
            </SafeAreaView >
        </>
    )
}

const styles = StyleSheet.create({
    bottomTab: {
        flexDirection: "row"
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
    header: {
        backgroundColor: "#ff8c00",
        alignSelf: "stretch",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        textTransform: "capitalize"
    },
    header_text: {
        alignSelf: "center",
        color: "white",
        fontSize: 30,
        fontStyle: "italic",
        fontWeight: "bold",
        marginTop: 10
    },
    logout: {
        borderRadius: 5,
        height: 60,
        width: 60,
        backgroundColor: "red"
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