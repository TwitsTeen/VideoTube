import React, { useContext, useEffect } from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { AuthContext } from "../../providers/AuthProvider";
import AuthScreen from "@/components/authScreen";

function profile() {
  const { userToken, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("profile : " + userToken);
  }, [userToken]);

  if (!userToken) {
    return (
      <View className="flex-1 justify-center items-center">
        <AuthScreen></AuthScreen>
      </View>
    );
  }
  return (
    <View className="flex-1 justify-center items-center">
      <Text>profile</Text>

      {userToken ? <Text>Logged in</Text> : <Text>Not logged in</Text>}
      <Text>Token: {userToken}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default profile;
