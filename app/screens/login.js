import React, { useCallback, useEffect, useState } from "react"
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Alert, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native"
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"
//import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default login = (props) => {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    //const db = getFirestore(app)
    const auth = getAuth(app)


    const signIn = async () => {
        console.log("in singIn()")
        let userCredentials = null
        try {
            userCredentials = await signInWithEmailAndPassword(auth, email.trim(), pwd)
        }
        catch (e) {
            console.log(e)
            if (/auth/.test(e)) Alert.alert("Invalid e-mail/password")
            else if (/least/.test(e)) Alert.alert("Password should be atleast 6 characters", "Your password is a little weak.")
            else if (/disable/.test(e)) Alert.alert("Temporarily disabled", "Too many failed Login attempts")
        }
        finally {
            if (userCredentials !== null && !userCredentials.user.emailVerified)
                Alert.alert("Not Verified", "Please complete verification sent to your e-mail.")
        }
    }


    const signUp = async () => {
        console.log("in signUp", email.trim(), pwd)
        let userCredentials = null
        try {
            userCredentials = await createUserWithEmailAndPassword(auth, email, pwd)
        }
        catch (e) {
            if (/invalid/.test(e)) Alert.alert("Invalid e-mail", "Please make sure the fields aren't empty.")
            else if (/already/.test(e)) Alert.alert("Email already in use", " Forgot your password? click on 'Forgot Password'.")
            else if (/missing/.test(e)) Alert.alert("Please provide e-mail", "We need your e-mail to create an a/c.")
            else if (/should be at least/.test(e)) Alert.alert("Password must be atleast 6 characters", "Your password is a little weak.")
            else Alert.alert(e)
        }
        // for emai verification so that we let in only genuine users
        finally {
            if (userCredentials != null && userCredentials.user != null) {
                sendEmailVerification(userCredentials.user)
                Alert.alert("Verification e-mail sent", "Please open your mail app. and click on the link to complete verification.")
            }
        }
    }
    const forgot = async () => {
        if (email == "") Alert.alert("Enter email")
        else {
            try {
                await sendPasswordResetEmail(auth, email)
            }
            catch (e) {
                console.log(e)
                if (/user-not-found/.test(e)) Alert.alert("User dosen't exist.")
                else if (/auth/.test(e)) Alert.alert("Invalid e-mail/password")
                else if (/least/.test(e)) Alert.alert("Password should be atleast 6 characters", "Your password is a little weak.")
                else if (/disable/.test(e)) Alert.alert("Temporarily disabled", "Too many failed Login attempts")
                else Alert.alert(e)
            }
            Alert.alert("Password reset mail sent", "Please open your mail app. and click on the link to complete reset.")
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView style={{flex:1}}>
                < IconMaterial name={"sign-caution"} size={30} style={styles.position} />
                <View style={styles.inner}>
                    <Text style={styles.heading}>
                        Sign up
                    </Text>
                    <TextInput style={styles.input} placeholder="E-mail here" onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder="Password here" onChangeText={setPwd} />
                    <Pressable style={({ pressed }) => [styles.sign, { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'gold' }]}
                        onPress={signUp}>
                        <Text style={styles.sub}>Submit</Text>
                    </Pressable>
                </View>
                <View style={styles.inner}>
                    <Text style={styles.heading}>
                        Log in
                    </Text>
                    <TextInput style={styles.input} placeholder="E-mail here" onChangeText={setEmail} />
                    <TextInput style={styles.input} placeholder="Password here" onChangeText={setPwd} type="password" />
                    <Pressable style={({ pressed }) => [styles.sign, { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'gold' }]}
                        onPress={signIn}>
                        <Text style={styles.sub}>Login</Text>
                    </Pressable>
                    <Text style={styles.forgot} onPress={() => forgot()}>Forgot password</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        backgroundColor: "mediumblue",
        marginTop: Platform.OS === "android" ? 40 : 40,
    },
    forgot: {
        color: "white",
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 20
    },
    heading: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",

    },
    input: {
        backgroundColor: "tomato",
        padding: 20,
        borderRadius: 20,
        marginTop: 5,
    },
    inner: {
        flex: 1,
        marginTop: 25,
        padding: 5,
        alignContent: "center",
        justifyContent: "center"
    },
    position: {
        alignSelf: "center",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "gold"
    },
    sign: {
        borderRadius: 20,
        backgroundColor: "gold",
        marginTop: 5,
        padding: 15,
    },
    sub: {
        fontWeight: "bold",
        fontSize: 15,
        alignSelf: "center"
    }
})