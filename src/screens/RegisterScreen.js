import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth, db, storage } from '../config/firebase'; // Importa la base de datos y storage
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Importa setDoc y doc para Firestore
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [comidaFavorita, setComidaFavorita] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'El formato del email es inválido';

    if (!password) errors.password = 'La contraseña es requerida';
    else if (!validatePassword(password)) {
      errors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)';
    }

    if (!confirmPassword) errors.confirmPassword = 'La confirmación de contraseña es requerida';
    else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!name) errors.name = 'El nombre es requerido';
    if (!comidaFavorita) errors.comidaFavorita = 'La comida favorita es requerida';

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setError({});
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      // Actualizar el perfil del usuario
      await updateProfile(user, { displayName: name, photoURL });

      // Guardar datos en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        displayName: name,
        comidaFavorita: comidaFavorita,
        photoURL: photoURL || '',
        email: user.email,
        uid: user.uid,
      });

      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError({ general: error.message });
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Registro
      </Text>
      <Input
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        errorMessage={error.name}
      />
      <Input
        placeholder="Comida Favorita"
        value={comidaFavorita}
        onChangeText={setComidaFavorita}
        errorMessage={error.comidaFavorita}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        errorMessage={error.email}
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        errorMessage={error.password}
      />
      <Input
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        errorMessage={error.confirmPassword}
      />
      {imageUri && (
        <Text style={styles.success}>Imagen seleccionada correctamente</Text>
      )}
      {error.general && <Text style={styles.error}>{error.general}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button
            title="Seleccionar Imagen de Perfil"
            onPress={pickImage}
            containerStyle={styles.button}
          />
          <Button
            title="Registrarse"
            onPress={handleRegister}
            containerStyle={styles.button}
          />
          <Button
            title="Ya tengo cuenta"
            type="outline"
            onPress={() => navigation.navigate('Login')}
            containerStyle={styles.button}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
});
