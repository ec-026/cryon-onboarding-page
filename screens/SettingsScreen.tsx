import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import firebase from '../utils/firebaseConfig';
import { NavigationProp, useNavigation } from '@react-navigation/native';
type User = {
    name: string;
    email: string;
    phone: string;
};
type RootStackParamList = {
    SignIn: undefined; // Other params can be added here
    Settings: undefined; // Assuming settings does not take any params
};
const SettingsScreen = () => {
    
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const marginPercentage = 0.1; // Adjust as needed
    
    const headerMarginBottom = windowHeight * marginPercentage;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const userId = currentUser.uid;
                const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    if (typeof userData?.name === 'string' && typeof userData?.email === 'string' && typeof userData?.phone === 'string') {
                        const userFormatted: User = {
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone
                        };
                        setUser(userFormatted);
                    } else {
                        console.log('Incomplete user data');
                        setUser(null);
                    }
                } else {
                    console.log('No user data found');
                    setUser(null);
                }
            } else {
                console.log('No user is signed in');
                setUser(null);
            }
            setLoading(false);
        };
    
        fetchUserData();
    }, []);
    
    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { marginBottom: headerMarginBottom }]}>User Settings</Text>
            <View style={styles.infoContainer}>
                {user ? (
                    <>
                        <Text style={styles.info}>Name: {user.name}</Text>
                        <Text style={styles.info}>Email: {user.email}</Text>
                        <Text style={styles.info}>Phone: {user.phone}</Text>
                    </>
                ) : (
                    <Text>No user data available</Text>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <View style={styles.footer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        backgroundColor: '#121212',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    title: {
        marginTop: 40,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 40,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
        color: '#ccc',
    },
    button: {
        backgroundColor: '#1a73e8',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    footer: {
        marginBottom: 20,
    },
});

export default SettingsScreen;
