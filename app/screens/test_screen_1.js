import React  from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default test_screen_1 = ({navigation}) => {
return (
    <SafeAreaView style={styles.container}>
        <Text>
            Screen 1
        </Text>
        <Button 
            title="go to store"
            //use the name prop for navigation
            onPress={()=>navigation.navigate('store', {
                name: "Syed Arbaaz Khurram",
                rollno: 83
            })}
        />
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
  