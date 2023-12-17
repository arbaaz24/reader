import React from "react";

import { Linking, StyleSheet, Text, View } from "react-native";
const colors = [`#0000ff`, `#a52a2a`, `#ff1493`, `#ff8c00`, `#ff00ff`, `#006400`, `#8b008b`, `#ff0000`]
const align = ["flex-start", "flex-end"]
const margin = [7, 0]
export default Box = ({ item, limit }) => {
  return (
    <View style={{ padding: 3 }}>
      {(parseInt(item.id) <= limit) ?
        !/link/.test(item.name) ?//!photo -- for photo we can add code later
          <View style={[styles.box, {
            alignSelf: align[parseInt(item.id) % 2],
            marginLeft: margin[parseInt(item.id) % 2],
            marginRight: margin[parseInt(item.id) % 2],
          }]}>
            <Text style={{ fontSize: 15, fontWeight: "normal", color: colors[parseInt(item.id) % 8] }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "900" }}>
              {/* {item.id} */}
              {item.words}
            </Text>
          </View>
          :
          <Text style={{ color: 'blue' }}
            onPress={() => Linking.openURL(item.words)}>
            {item.words}
          </Text>
        :
        null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    maxWidth: "90%",
    padding: 6,
    backgroundColor: "white",

  },
  img: {
    height: 50,
    width: 50,
    alignSelf: "center"
  }
})