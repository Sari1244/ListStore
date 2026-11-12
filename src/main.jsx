import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CardListClients from '../components/ListCardClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main() {

  // Control de visibilidad del modal
  const [visibleModal, setVisibleModal] = useState(false);

  // Estados para los campos del formulario
  const [nameCeClients, setNameClients] = useState("");
  const [ageCeClients, setAgeClients] = useState("");
  const [locationCeClients, setLocationClients] = useState("");

  // Estado para saber si estamos editando (guarda el ID del cliente o null si es nuevo)
  const [currentId, setCurrentId] = useState(null);

  // Listado de clientes
  const [listClients, setListClients] = useState([]);

  useEffect(() => {
    obtenerData();
  }, []);

  const obtenerData = async () => {
    let dataStorage = await AsyncStorage.getItem("@clientsData");
    setListClients(dataStorage ? JSON.parse(dataStorage) : []);
  };   

  // 1. Función para Guardar o Actualizar
  const saveDataClients = async () => {
    if (!nameCeClients || !ageCeClients || !locationCeClients) {
      alert("Por favor completa todos los campos");
      return;
    }

    let newData;

    if (currentId !== null) {
      // --- ACTUALIZAR ---
      newData = listClients.map(client => 
        client.id === currentId 
          ? { ...client, nombre: nameCeClients, edad: ageCeClients, direccion: locationCeClients }
          : client
      );
    } else {
      // --- CREAR ---
      const newClient = {
        id: Date.now().toString(), // ID único basado en el tiempo
        nombre: nameCeClients,
        edad: ageCeClients,
        direccion: locationCeClients
      };
      newData = [...listClients, newClient];
    }

    // Guardar en AsyncStorage y actualizar estado
    await AsyncStorage.setItem("@clientsData", JSON.stringify(newData));
    setListClients(newData);
    
    // Limpiar formulario y cerrar modal
    limpiarFormulario();
  };

  // 2. Función para Eliminar
  const deleteClient = async (id) => {
    let newData = listClients.filter(client => client.id !== id);
    await AsyncStorage.setItem("@clientsData", JSON.stringify(newData));
    setListClients(newData);
  };

  // 3. Función para Preparar la Edición (Carga datos en el modal)
  const prepareUpdate = (client) => {
    setCurrentId(client.id);
    setNameClients(client.nombre);
    setAgeClients(client.edad);
    setLocationClients(client.direccion);
    setVisibleModal(true);
  };

  const limpiarFormulario = () => {
    setNameClients("");
    setAgeClients("");
    setLocationClients("");
    setCurrentId(null);
    setVisibleModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleListClients}>
        <Text style={styles.titleListClient}>LISTADO DE CLIENTES</Text>
        <StatusBar style="auto" />
      </View>
      
      <View style={styles.containerList}>
        <FlatList
          data={listClients}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Pailas, no tienes datos</Text>
          )}
          renderItem={({ item }) => (
            <CardListClients 
              nombre={item.nombre} 
              edad={item.edad} 
              direccion={item.direccion} 
              onDelete={() => deleteClient(item.id)}
              onEdit={() => prepareUpdate(item)}
            />
          )}
        />
      </View>

      <Pressable
        onPress={() => {
          limpiarFormulario();
          setVisibleModal(true);
        }}
        style={styles.newRegister}>
        <Text style={styles.TextnewRegister}>+</Text>
      </Pressable>

      {/* Componente del Modal */}
      <Modal
        visible={visibleModal}
        animationType='slide'
      >
        <View style={{ flex: 1 }}>
          <View style={styles.headerModal}>
            <Text style={styles.textTitleModal}>
              {currentId !== null ? "Editar cliente" : "Nuevo cliente"}
            </Text>
            <Pressable onPress={limpiarFormulario}>
              <Text style={styles.textTitleModal}>X</Text>
            </Pressable>
          </View>
          
          <View style={styles.bodyFormClients}>
            <View style={styles.formControl}>
              <Text>Nombre completo</Text>
              <TextInput style={styles.inputText}
                placeholder='Tu Nombre'
                value={nameCeClients}
                onChangeText={setNameClients}
              />
            </View>
            <View style={styles.formControl}>
              <Text>Edad</Text>
              <TextInput style={styles.inputText}
                value={ageCeClients}
                placeholder='Tu Edad'
                keyboardType="numeric"
                onChangeText={setAgeClients}
              />
            </View>
            <View style={styles.formControl}>
              <Text>Dirección</Text>
              <TextInput style={styles.inputText}
                placeholder='Tu Dirección'
                value={locationCeClients}
                onChangeText={setLocationClients}
              />
            </View>
            
            <Pressable
              onPress={saveDataClients}
              style={styles.btnSaveData}>
              <Text style={styles.textBtnSaveData}>
                {currentId !== null ? "ACTUALIZAR DATOS" : "GUARDAR DATOS"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerList: { flex: 1, padding: 10 },
  titleListClients: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050047'
  },
  titleListClient: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  newRegister: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: 'blue',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  TextnewRegister: {
    color: 'white',
    fontSize: 36,
    marginBottom: 4
  },
  headerModal: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#050047',
    alignItems: 'center'
  },
  textTitleModal: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bodyFormClients: { padding: 20, flex: 1 },
  formControl: { marginTop: 15 },
  inputText: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    borderRadius: 8,
    paddingLeft: 8,
    marginTop: 5
  },
  btnSaveData: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: '#3326A8',
    width: '90%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  textBtnSaveData: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});