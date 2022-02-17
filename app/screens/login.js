import React, { useCallback, useEffect, useState } from "react"
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, Alert, View } from "react-native"
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { doc, getFirestore, collection, getDocs, query, getDoc, setDoc } from "firebase/firestore"
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default login = ({ navigation, route }) => {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const db = getFirestore(app)
    const auth = getAuth(app)


    const signIn = async () => {
        console.log("in singIn()")
        let userCredentials = null
        try {

            userCredentials = await signInWithEmailAndPassword(auth, email, pwd)
        }
        catch (e) {
            console.log(e)
            if (/auth/.test(e)) Alert.alert("Invalid e-mail/password", "maybe fields are empty")
            else if (/least/.test(e)) Alert.alert("Password should be atleast 6 characters", "Your password is a little weak.")
            else if(/disable/.test(e)) Alert.alert("Temporarily disabled",  "Too many failed Login attempts")
        }
        finally {
            if (userCredentials !== null && userCredentials.user.emailVerified) {
                //for now we are not making a separate doc. for each user to minimise R/W
                // const uid = userCredentials.user.uid
                // const email = userCredentials.user.email
                // const snap = await getDoc(doc(db, 'users', uid))

                // if (!snap.exists()) {
                //     //setDoc() is asynchronous, make sure data is written and fetched correctly
                //     await setDoc(doc(db, 'users', uid), { "uid": uid, "email": email })
                //     console.log("just created user uid doc in firestore --> ", snap.data())
                //     Alert.alert("Ka-Boom! You just logged-in, Please restart the app. ")
                // }
                null
            }
            else if (userCredentials !== null && !userCredentials.user.emailVerified) Alert.alert("Not Verified", "Please complete verification sent to your e-mail.")
        }
    }


    const signUp = async () => {
        console.log("in signUp", email, pwd)
        let userCredentials = null
        try {
            userCredentials = await createUserWithEmailAndPassword(auth, email, pwd)
        }
        catch (e) {
            if (/invalid/.test(e)) Alert.alert("Invalid e-mail", "Please make sure the fields aren't empty.")
            else if (/already/.test(e)) Alert.alert("Email already in use", " Forgot your password? click on 'Forgot Password' to get a new password.")
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

    return (
            <View style={{ flex: 1, alignContent: "center", backgroundColor: "yellow", }}>
                < IconMaterial name={"sign-caution"} size={30} style={{ alignSelf: "center" }} />
                <View>
                    <Text style={{fontSize:40}}>
                        Sign up
                    </Text>
                    <TextInput placeholder="E-mail here" onChangeText={setEmail} />
                    <TextInput placeholder="Password here" onChangeText={setPwd} />
                    <Pressable style={{ borderRadius: 20, height: 40, width: 40, backgroundColor: "blue" }}
                        onPress={signUp}
                    >
                        <Text style={{ alignSelf: "center" }}>Submit</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: 25, backgroundColor: "green" }}>
                    <Text style={{fontSize:40}}>
                        Log in
                    </Text>
                    <TextInput placeholder="E-mail here" onChangeText={setEmail} />
                    <TextInput placeholder="Password here" onChangeText={setPwd} />
                    <Pressable style={{ borderRadius: 5, height: 40, width: 40, backgroundColor: "blue" }}
                        onPress={signIn}
                    ></Pressable>
                </View>
            </View>
    )
}