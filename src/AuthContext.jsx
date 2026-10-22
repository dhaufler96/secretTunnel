import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async(username) => {
    const response = await fetch('https://fsa-jwt-practice.herokuapp.com/signup', {
      method: 'POST',
      headers: {
        "Constent-Type": "Application/json"
      },
      body: JSON.stringify({
        username: username,
        password: "password123"
      })
    });

    const { token } = await response.json();
    setToken(token)
    setLocation("TABLET");
  }

  // TODO: authenticate
  const authenticate = async() => {
    if(!token) {
      throw Error('Token Required')
    } else {
      const response = await fetch('https://fsa-jwt-practice.herokuapp.com/authenticate', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if(!response.ok) {
        throw Error('Failed to authenticate');
      } else {
        setLocation("TUNNEL");
      }
    }
  }
  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
