import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import "expo-dev-client";
import auth, { firebase } from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";

import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import Task from "./components/Task";

export default function App() {
  const [text, setText] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(
      date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec
    );
  }, []);

  const HandleAddTask = () => {
    setTaskItems([...taskItems, text]);
    setText(null);
  };

  const completeTask = (index) => {
    let itemCopy = [...taskItems];
    itemCopy.splice(index, 1);
    setTaskItems(itemCopy);
  };

  GoogleSignin.configure({
    webClientId:
      "706762384411-4t06kpuo4c54e8bnjmu3njnesr660vgm.apps.googleusercontent.com",
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onGoogleButtonPress = async () => {
    // // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(() => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error) {
      //console.error(error);
    }
  };

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        {/* Header section */}
        <View style={styles.mainCircle}>
          <Text style={styles.header}>Welcome</Text>
          <Text style={styles.header}>My To-do List</Text>
        </View>
        <View style={styles.subCircle}>
          <Text style={{ fontSize: 33, color: "#ffffff", fontWeight: "300" }}>
            Login
          </Text>
        </View>

        {/* Login section */}
        <View style={styles.login}>
          <Text style={{ fontSize: 20, fontWeight: "400", letterSpacing: 5 }}>
            Sign in WIth
          </Text>
          <TouchableOpacity onPress={onGoogleButtonPress}>
            <Image
              source={require("./assets/google.png")}
              style={{
                width: 70,
                height: 70,
                borderWidth: 3,
                borderColor: "#D46C6C",
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Create account section */}
        <View style={styles.createAccount}>
          <Text style={{ fontSize: 15, fontWeight: "300", color: "#711E1E" }}>
            Don't have an google account ?
          </Text>
          <TouchableOpacity>
            <Text style={{ margin: 10, fontWeight: "700", color: "#711E1E" }}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.desin}>
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: 130,
            marginLeft: -100,
          }}
        >
          <Text style={{ fontSize: 40 }}>Hi</Text>
          <Text style={{ marginLeft: 9, fontSize: 20, marginTop: 10 }}>
            {user.displayName}
          </Text>
        </View>
      </View>
      <View style={styles.Header}>
        <Text
          style={{ fontSize: 40, fontFamily: "cursive", fontWeight: "600" }}
        >
          Add your To-Dos
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Icon name="log-out" size={20} color="#600A0A" />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "#600A0A",
          }}
        >
          Log out
        </Text>
      </TouchableOpacity>

      {/* <Button title="Sign Out" onPress={signOut} style={{ marginTop: 100 }} /> */}

      {/* Todo list goes here */}

      <ScrollView style={styles.todos}>
        {taskItems.map((text, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
              <Text style={{ alignSelf: "center", marginBottom: 10 }}>
                {currentDate}
              </Text>
              <Task text={text} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Task Input Area */}

      <KeyboardAvoidingView
        style={{
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center",
          marginBottom: 10,
        }}
        behavior="padding"
      >
        <TextInput
          style={styles.textArea}
          onChangeText={(text) => {
            setText(text);
          }}
          placeholderTextColor="rgba(113,30,30,0.5)"
          placeholder="Write To Do"
        />
        <TouchableOpacity style={styles.button} onPress={HandleAddTask}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCircle: {
    position: "absolute",
    zIndex: 1,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#F5C5C5",
    justifyContent: "center",
    alignItems: "center",
    left: 50,
    top: -50,
  },
  header: {
    fontSize: 40,
    fontWeight: "400",
    fontFamily: "cursive",
  },

  subCircle: {
    position: "relative",
    zIndex: 0.1,
    top: 200,
    width: 200,
    height: 200,
    backgroundColor: "#D46C6C",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  login: {
    position: "absolute",
    bottom: 180,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  createAccount: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },

  // ----------------------------------------------------------------------------

  desin: {
    height: 400,
    width: 400,
    backgroundColor: "#F5C5C5",
    borderRadius: 200,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -200,
  },

  Header: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
  },
  taskInputArea: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  textArea: {
    width: 250,
    height: 56,
    backgroundColor: "#EFE7E7",
    borderRadius: 23,
    padding: 10,
    color: "#570404",
  },

  button: {
    width: 58,
    height: 53,
    borderRadius: 29,
    backgroundColor: "#EFE7E7",
  },

  buttonText: {
    fontSize: 68,
    color: "#600A0A",
    marginVertical: -20,
    textAlign: "center",
    fontWeight: "100",
  },
  todos: {
    marginTop: 230,
    marginBottom: 50,
  },
  signOutButton: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    width: "22%",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
