import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';


type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const useDisableBack = (navigation: NavigationProp<ParamListBase>) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          return true; // Disable back functionality only for ArtistDashboard screen
        }
        return false; // Allow back functionality for other screens
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );
};

const ArtistDashboard: React.FC<Props> = ({ navigation }) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const marginPercentage = 0.1;
  
  const headerMarginBottom = windowHeight * marginPercentage;

  useDisableBack(navigation);// Call the custom hook to disable back functionality

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginBottom: headerMarginBottom }]}>
        <Text style={styles.welcomeText}>Welcome to the Artist Dashboard!</Text>
      </View>
      <View>
        <Text style={styles.messageText}>Here's where all the magic happens. Stay tuned for updates, events, and more just for you!</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },

  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%', 
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ccc',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%', 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ArtistDashboard;
