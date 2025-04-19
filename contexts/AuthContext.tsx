import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '@/services/appwrite';
import { Models } from 'react-native-appwrite';

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Models.User<Models.Preferences> | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fecthUserData = async () => {
        try {
            await fetchUser();
        } catch (error) {
            console.log("Error fetching user nih:", error);
        }
    }

    fecthUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
