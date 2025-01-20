tarea 2 Enzo Perines Navarro
Crear una app que pueda registrar nombre y comida favorita y esos datos se guarden en firebase , con una pantalla de login, una de registrer y el home.

·usado en visual studio code
se debe crear una carpeta con el nombre que queramos
con el comando cmd ,nos localizamos en esa carpeta y con (cd) nos movemos a ella.
instalamos:
npm firebase
npm install react-native-image-picker
npm install @react-native-firebase/storage
creamos un archivo de react native (instrucciones detalladas en el pdf y text del repositorio)

se debe tener una base de datos en firebase database
se debe tener la opcion de compilacion : Authentication ,solo con la opcion de correo
se debe tener la opcion de compilacion : storage, aunque no funciona con plan gratis el codigo de aqui permitiria subir la imagen

en configuracion de acceso dentro de la consola de firebase (https://console.firebase.google.com/project) se debe seleccionar (agregar app ) y crear nueva plataforma tipo web y se debe copiar el codigo que entrega y pegarlo en el file (firebase) del repositorio:
ej:
const firebaseConfig = {
  apiKey: "AIzaSyCT66_Agj-SwiQQg_WzYfJqNw6EGVIzxPE",
  authDomain: "mi-comida-favorita-512fb.firebaseapp.com",
  projectId: "mi-comida-favorita-512fb",
  storageBucket: "mi-comida-favorita-512fb.firebasestorage.app",
  messagingSenderId: "418418755344",
  appId: "1:418418755344:web:63d0d128188904f7ee0795",
  measurementId: "G-546KKH91V3"
};

ese codigo que te entregara con otros valores los debes pegar en el file (firebase) del repositorio solo en la parte que corresponde.

luego con eso el proyecto se inicia en visual studio code y con los comandos:
npm start (en la consola cmd de windows)
y con la app (expo go) se inicia a traves de codigo qr
---------------------------------------------------------------------------------------------------------------------------------------
mejoras incluidas
1)email valido
2)contraseña con requisitos especiales
3) confirmacion de contraseña
4) nombre requerido
5)mensajes de error detallados en cada campo

indicador de carga 
1) boton deshabilitado mientras se esta registrando

manejo de imagen de perfil (no funciona en plan gratis)
1)seleccion de imagen desde la galeria
2)subida de imagen a firebase 

mensajes visuales
1) indicador de exito si la imagen fue seleccionada correctamente
2) indicador de errores en el formulario o el registro

PD: profesor el video que alcanze a subir a la plataforma de teams no es el final, tuve problemas con la base de datos y no me la reconocia tengo el video con la funcionalidad 
completa corectamente funcionando pero ya no alcanze a subirlo porque se cerro el tiempo, espero su comprension.



