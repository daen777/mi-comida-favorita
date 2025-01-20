import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Text } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
        setImage(docSnap.data().photoURL || null); // Cargar la URL de la imagen si existe
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), { photoURL: downloadURL });

      setImage(downloadURL);
      Alert.alert('Éxito', 'Imagen actualizada correctamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Alert.alert('Error', 'No se pudo actualizar la imagen');
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No hay imagen de perfil</Text>
        </View>
      )}
      <Text style={styles.text}>
        <Text style={styles.label}>Nombre:</Text> {profile.displayName || 'No especificado'}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Comida Favorita:</Text> {profile.comidaFavorita || 'No especificada'}
      </Text>
      <Button title="Seleccionar Imagen" onPress={handleImagePick} />
      <Button title="Cerrar Sesión" onPress={() => auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

