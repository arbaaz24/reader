import React, { useCallback, useEffect, useState } from "react"
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { doc, getFirestore, collection, getDocs, query, getDoc, setDoc } from "firebase/firestore"
import { firebaseConfig } from "../components/firebaseConfig"


const app = initializeApp(firebaseConfig)

export default login = ({ navigation, route }) => {
    const [user, setUser] = useState(null)
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
            if (/auth/.test(e)) alert("Invalid email/password")
            else if (/least/.test(e)) alert("Password should be atleast 6 characters")
        }
        finally {
            if (userCredentials !== null && userCredentials.user.emailVerified) {
                const uid = userCredentials.user.uid
                const email = userCredentials.user.email
                const snap = await getDoc(doc(db, 'users', uid))

                if (!snap.exists()) {
                    //setDoc() is asynchronous, make sure data is written and fetched correctly
                    setDoc(doc(db, 'users', uid), { "uid": uid, "email": email })
                    console.log("just created user uiod doc in firestore --> ", snap.data())
                }
            }
            else if (userCredentials !== null && !userCredentials.user.emailVerified) alert("Please complete verification sent to your email.")
        }
    }

    

    const logOut = async () => {
        await signOut(auth)
        setEmail("")
        setPwd("")
        setUser(null)
    }

    const signUp = async () => {
        console.log("in signUp", email, pwd)
        let userCredentials = null
        try {
            if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pwd)) throw "weak pwd"
            userCredentials = await createUserWithEmailAndPassword(auth, email, pwd)
        }
        catch (e) {
            if (/invalid/.test(e)) alert("Invalid email")
            else if (/already/.test(e)) alert("Email already in use")
            else if (e === "weak pwd") alert("Passphrase must be have 8 characters, at least 1 letter, 1 number and 1 special character(@$!%*#?&)")
            else alert(e)
            console.log(e)
        }
        // for emai verification so that we let in only genuine users
        finally {
            if (userCredentials != null && userCredentials.user != null) {
                sendEmailVerification(userCredentials.user)
                alert("Verification e-mail sent")
            }
        }
    }

    return (
        <>
            
            
                    <View style={{ flex: 1, alignContent: "center", backgroundColor: "yellow", }}>
                        < IconMaterial name={"sign-caution"} size={30} style={{ alignSelf: "center" }} />
                        <View>
                            <Text>
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
                            <Text>
                                Log in
                            </Text>
                            <TextInput placeholder="E-mail here" onChangeText={setEmail} />
                            <TextInput placeholder="Password here" onChangeText={setPwd} />
                            <Pressable style={{ borderRadius: 5, height: 40, width: 40, backgroundColor: "blue" }}
                                onPress={signIn}
                            ></Pressable>
                        </View>
                        <Text>in login</Text>
                    </View>
            
        </>
    )
}