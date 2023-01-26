import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Task = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.squre} />
        <Text style={{ marginLeft: 10 }}>{props.text}</Text>
      </View>
      <View style={styles.circle} />
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFE7E7",
    marginHorizontal: 20,
    borderRadius: 10,
    height: 50,
    marginBottom: 30,
  },

  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    marginLeft: 10,
    maxWidth: "100%",
  },
  squre: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#2258E3",
    opacity: 0.4,
  },
  circle: {
    position: "absolute",
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: "#F9F2F2",
    borderColor: "#ED0808",
    borderWidth: 2,
    marginHorizontal: 290,
    marginVertical: 15,
  },
});
