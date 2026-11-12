import { StyleSheet, Text, View, Pressable } from "react-native";

export default function CardListClients({ nombre, edad, direccion, onDelete, onEdit }) {
    return (
        <View style={styles.cardCliet}>
            <View>
                <Text style={styles.textCardClints}>Nombre : <Text style={styles.TextInter}>{nombre.toUpperCase()}</Text></Text>
                <Text style={styles.textCardClints}>Edad:  <Text style={styles.TextInter}>{edad} años</Text></Text>
                <Text style={styles.textCardClints}>Dirección:  <Text style={styles.TextInter}>{direccion}</Text></Text>
            </View>

            <View style={styles.containerButtons}>
                <Pressable style={[styles.btnAction, styles.btnEdit]} onPress={onEdit}>
                    <Text style={styles.textBtn}>Editar</Text>
                </Pressable>
                <Pressable style={[styles.btnAction, styles.btnDelete]} onPress={onDelete}>
                    <Text style={styles.textBtn}>Eliminar</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardCliet: {
        backgroundColor: '#FFFFFF',
        gap: 6,
        marginTop: 12,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E1DDF5',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },
    textCardClints: {
        fontSize: 17,
        color: '#38334A',
    },
    TextInter: {
        fontWeight: 'bold',
        color: '#3326A8',
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10
    },
    btnAction: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnEdit: {
        backgroundColor: '#4A3ACC',
    },
    btnDelete: {
        backgroundColor: '#D9534F',
    },
    textBtn: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14
    }
});