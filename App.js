import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "expo-dev-client";
import auth, { firebase } from "@react-native-firebase/auth";

import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

export default function App() {
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
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 40 }}>Hi</Text>
          <Text style={{ marginLeft: 9, fontSize: 20 }}>
            {user.displayName}
          </Text>
        </View>
      </View>

      <Button title="Sign Out" onPress={signOut} style={{ marginTop: 100 }} />
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
    top: -150,
  },
});
