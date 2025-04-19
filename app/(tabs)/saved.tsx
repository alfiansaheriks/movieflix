import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/services/useFetch";
import { fetchMovieById, fetchMovieDetails, fetchMovies } from "@/services/api";
import { images } from "@/constants/images";
import { router } from "expo-router";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  //handle saved movies only
  useEffect(() => {
    const fetchSavedMovies = async () => {
      if (!user) {
        return;
      }
      setLoading(true);
      try {
        const movieIds = await getSavedMovies(user.$id);
        const movieDetails = await Promise.all(
          movieIds.map((id) => fetchMovieById(id))
        );
        // console.log("movie details: ", movieDetails)
        setSavedMovies(movieDetails);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMovies();
  }, [user]);

  // console.log("Saved movies:", savedMovies);

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000fff"
            className="mt-10 self-center"
          />
        ) : savedMovies.length === 0 ? (
          <Text className="text-light-100 font-bold text-lg text-center mt-10">
            No saved movies
          </Text>
        ) : (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "center",
              gap: 10,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        )}
        <></>
      </ScrollView>
    </View>
  );
};

export default Saved;
