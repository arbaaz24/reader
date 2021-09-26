import React from "react";
import {
   Text, View} from "react-native";
export default Box = ({ item }) => {
    const colors = [`#90ee90`, `#e0ffff`, `#7fffd4`, `#f0f8ff`, `#afeeee`, `#00ff7f`, `#40e0d0`, `#ffc0cb`];
    const align = ["flex-start", "flex-end"];
    const margin = [7, 0];
    return (
        <View style={{ padding: 4 }}>
            {(parseInt(item.id) <= 50) ? //using ternary inside a ternary oprtr
                <View style={{ alignSelf: align[parseInt(item.id) % 2], maxWidth: "90%", backgroundColor: colors[parseInt(item.id) % 2], borderRadius: 10, marginLeft: margin[parseInt(item.id) % 2], marginRight: margin[parseInt(item.id) % 2], padding: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {item.name}
                    </Text>
                    <Text >
                        {item.id}
                        {item.words}
                    </Text>
                </View>
                :
                null
            }
        </View>
    );
};