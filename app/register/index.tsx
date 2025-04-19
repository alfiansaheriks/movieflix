import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import { createAccount } from "@/services/appwrite";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      const response = await createAccount(formData);
      console.log("Account created successfully:", response);
      router.replace("/profile");
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex justify-center items-center flex-1 flex-col gap-5 px-10">
        <View className="size-10 rounded-full mb-5">
          <Image source={icons.person} className="w-full h-full" />
        </View>
        <TextInput
          className="bg-secondary text-white w-full h-12 rounded-lg px-5"
          placeholder="Email"
          autoComplete="email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          className="bg-secondary text-white w-full h-12 rounded-lg px-5"
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        <View className="flex-row items-center justify-center">
          <TextInput
            className="bg-secondary text-white w-full h-12 rounded-lg px-5"
            placeholder="Password"
            value={formData.password}
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
        <TouchableOpacity className="bg-violet-500 w-full h-12 rounded-lg flex justify-center items-center" onPress={handleRegister}>
          <Text className="text-white font-semibold text-base">Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-secondary border border-accent w-full h-12 rounded-lg flex justify-center items-center"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-white font-semibold text-base">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
