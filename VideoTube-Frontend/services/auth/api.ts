import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_BASE_API_URL;

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()).data;

    if (response.ok) {
      // Save token
      await AsyncStorage.setItem("token", data.token);
      return { success: true, token: data.token };
    } else {
      console.log(data);
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        c_password: confirmPassword,
      }),
    });

    const data = (await response.json()).data;

    if (response.ok) {
      // Save token
      await AsyncStorage.setItem("token", data.token);
      return { success: true, token: data.token };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

const me = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await fetch(`${apiUrl}/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};
