import React  from "react";
import {  SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default test_screen_1 = ({navigation}) => {
return (
   <SafeAreaView style={{ flex: 1 }}>
       <Tab.Navigator>
       <Tab.Screen name="store" component={test_screen_2}/>
       <Tab.Screen name="subscribed" component={subscribed}/>
       <Tab.Screen name="my account" component={myaccount} />
       </Tab.Navigator>
   </SafeAreaView>
)
}

const styles = StyleSheet.create({
    container: {
        alignItems:"center",
      backgroundColor: `#fffaf0`,
      flex: 1,
      justifyContent: 'center',
      marginTop: Platform.OS === "android" ? 40 : 0,
    },
  });
  