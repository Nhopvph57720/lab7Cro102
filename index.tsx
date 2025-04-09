// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig'; // đường dẫn đúng tới file firebaseConfig.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Theo dõi trạng thái đăng nhập của người dùng
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Hàm đăng ký
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Lỗi đăng ký: " + error.message);
    }
  };

  // Hàm đăng nhập
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Lỗi đăng nhập: " + error.message);
    }
  };

  // Hàm đăng xuất
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert("Lỗi đăng xuất: " + error.message);
    }
  };

  // Chờ Firebase xác nhận trạng thái
  if (initializing) return null;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcome}>Xin chào: {user.email}</Text>
          <Button title="Đăng xuất" onPress={handleSignOut} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Đăng nhập / Đăng ký</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Đăng ký" onPress={handleSignUp} />
          <View style={styles.spacer} />
          <Button title="Đăng nhập" onPress={handleSignIn} />
        </>
      )}
    </View>
  );
}

// Style đơn giản
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  spacer: {
    height: 10,
  },
  welcome: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
