import React from "react";
import {  SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default main = ({navigation, route}) => {

return (
   <SafeAreaView style={styles.container}>
       <Tab.Navigator screenOptions={{ headerShown: false,cardShadowEnabled:true, gestureEnabled: true}}>
       <Tab.Screen name="store" component={store}/>
       <Tab.Screen name="subscribed" component={subscribed}/>
       <Tab.Screen name="my account" component={myaccount} />
       </Tab.Navigator>
   </SafeAreaView>
)
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: `black`,
      flex: 1,
      justifyContent: 'center',
      //marginTop: Platform.OS === "android" ? 40 : 0,
    },
  });
  