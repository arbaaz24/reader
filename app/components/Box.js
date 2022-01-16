import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
   const colors = [`#0000ff`, `#a52a2a`, `#ff1493`, `#ff8c00`, `#ff00ff`, `#006400`, `#8b008b`,`#ff0000`]
   const align = ["flex-start", "flex-end"]
   const margin = [7, 0]
export default Box = ({ item, limit }) => {
    return (
      <View style={{ padding: 4 }}>
        {(parseInt(item.id) <= limit)  ?
         !/photo/.test(item.name)  ?//!photo
          <View style={{
            alignSelf: align[parseInt(item.id) % 2],
            borderRadius: 10,
            maxWidth: "90%",
            padding: 8,
            backgroundColor: "white",
            marginLeft: margin[parseInt(item.id) % 2],
            marginRight: margin[parseInt(item.id) % 2],
          }}>
            <Text style={{ fontWeight: "bold",  color: colors[parseInt(item.id) % 8] }}>
              {item.name}
            </Text>
            <Text style={{}}>
              {/* {item.id} */}
              {item.words}
            </Text>
          </View>
          :
          <Image style={{height:50, width:50}} 
            source={{
                uri: "https:" + item.words,
            }}/>
          :
          null
        }
      </View>
    )
}

const styles = StyleSheet.create({
    container:{

    }
})