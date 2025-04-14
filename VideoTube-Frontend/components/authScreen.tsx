import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "@/providers/AuthProvider";

function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6">Login</Text>
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-6 border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>
      {loading ? <Text className="text-blue-500 mt-4">Loading...</Text> : null}
      {error ? <Text className="text-red-500 mt-4">{error}</Text> : null}
      <View className="flex-row mt-4">
        <Text className="text-gray-500">Don't have an account? </Text>
        <TouchableOpacity onPress={onSwitchToRegister}>
          <Text className="text-blue-500">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(name, email, password, confirmPassword);
    } catch (err) {
      setError("Registration failed : " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6">Register</Text>
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="w-52 bg-white p-4 rounded-lg mb-6 border border-gray-300"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg"
        onPress={handleRegister}
      >
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>
      {loading ? <Text className="text-blue-500 mt-4">Loading...</Text> : null}
      {error ? <Text className="text-red-500 mt-4">{error}</Text> : null}
      <View className="flex-row mt-4">
        <Text className="text-gray-500">Already have an account? </Text>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text className="text-blue-500">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View className="flex-1">
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </View>
  );
}
