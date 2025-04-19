// track the searches made by a user
import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const USER_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const SAVED_MOVIE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

  // console.log(result);
  // check if a record of tahat search has already been stored
  // if a document is found increment the searchCount field
  //if no document is found create new document in Appwrite database
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
          ])

          return result.documents as unknown as TrendingMovie[]
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const createAccount = async (user: RegisterProps) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    // store to users table
    await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        user_id: newAccount.$id,
        username: user.username,
        email: user.email,
      }
    );

    return newAccount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const loginAccount = async (user: LoginProps) => {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    // console.log("Gagal ambil user karena belum login:", error);
    return null;
  }
}


export const logoutAccount = async () => {
  try {
    const logout = await account.deleteSession('current');
    return logout;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const saveMovie = async (movie: MovieDetails, userId: string) => {
  try {
    const result = await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIE_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getSavedMovies = async (userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_MOVIE_COLLECTION_ID, [
      Query.equal('user_id', userId),
    ]);

    return result.documents.map((doc) => doc.movie_id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}