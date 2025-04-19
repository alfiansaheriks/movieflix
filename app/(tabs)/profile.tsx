import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentUser, loginAccount, logoutAccount } from "@/services/appwrite";
import { Models } from "react-native-appwrite";
import { useAuth } from "@/contexts/AuthContext";

const Profile = ({ email, password }: LoginProps) => {
  const {user, setUser} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    await loginAccount(formData);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      alert("Login failed");
      return;
    }
    setUser(currentUser);

    console.log("Login sukses:", currentUser);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // console.log("Error fetching user:", error);
        return null;
      }
    };

    checkUser();
  }, []);

const handleLogout = async () => {
    try {
      await logoutAccount();
      setUser(null);

      router.reload();
      console.log("Logout successful");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />

      {user ? (
        <View className="items-center justify-center flex-1 px-5">
          <Text className="text-white text-xl font-semibold">
            Halo, {user.name}
          </Text>
          <TouchableOpacity
            className="bg-secondary border border-accent w-full h-12 rounded-lg flex justify-center items-center mt-5"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex justify-center items-center flex-1 flex-col gap-5 px-10">
          <View className="size-10 rounded-full mb-5">
            <Image source={icons.person} className="w-full h-full" />
          </View>
          <View className="flex-row items-center gap-x-2">
            <TextInput
              className="bg-secondary text-white w-full h-12 rounded-lg px-5"
              placeholder="Email"
              autoComplete="email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>
          <View className="flex-row items-center justify-center">
            <TextInput
              className="bg-secondary text-white w-full h-12 rounded-lg px-5"
              placeholder="Password"
              value={password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry={!showPassword}
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              className="absolute right-5"
              onPress={toggleShowPassword}
            />
          </View>
          <TouchableOpacity
            className="bg-violet-500 w-full h-12 rounded-lg flex justify-center items-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-base">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-secondary border border-accent w-full h-12 rounded-lg flex justify-center items-center"
            onPress={() => router.push("/register")}
          >
            <Text className="text-white font-semibold text-base">Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Profile;
