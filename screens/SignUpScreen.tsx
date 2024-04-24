import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, TextInput, Button, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../utils/firebaseConfig';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    dob: null as Date | null,
    gender: '',
    userType: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const recaptchaVerifier = useRef(null);
  const [stage, setStage] = useState(1);
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to track confirm password visibility
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof userData, value: string) => {
    setUserData({ ...userData, [field]: value });
};
const handleDateChange = (event: any, selectedDate: Date | undefined) => {
  setDatePickerVisibility(false); // Hide the date picker regardless of the selection
  if (selectedDate) {
    setUserData({ ...userData, dob: selectedDate });
  }
};
  const handleEmailRegistration = async () => {
    try {
      setLoading(true);
      if (!userData.name) {
        setLoading(false);
        Alert.alert('Name Required', 'Please enter your name.');
        return;
      }
      if (!userData.dob) {
        setLoading(false);
        Alert.alert('Date of Birth Required', 'Please select your date of birth.');
        return;
      }
      if (!userData.gender) {
        setLoading(false);
        Alert.alert('Gender Required', 'Please select your gender.');
        return;
      }
      if (!userData.userType) {
        setLoading(false);
        Alert.alert('User Type Required', 'Please select your user type.');
        return;
      }
      if (!userData.email) {
        setLoading(false);
        Alert.alert('Email Required', 'Please enter your email.');
        return;
      }
      if (!userData.password) {
        setLoading(false);
        Alert.alert('Password Required', 'Please enter your password.');
        return;
      }
      if (!userData.confirmPassword) {
        setLoading(false);
        Alert.alert('Confirm Password Required', 'Please confirm your password.');
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setLoading(false);
        Alert.alert('Password Mismatch', 'The passwords do not match.');
        return;
      }
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
      setUser(userCredential.user);
      await userCredential.user?.sendEmailVerification();
      if (!userCredential.user) {
        Alert.alert('Error', 'User Credential not set!');
        return;
    }
      checkEmailVerification(userCredential.user);
      setStage(2);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
          Alert.alert('Error', error.message);
      } else {
          Alert.alert('Error', 'An unknown error occurred.');
      }
  }  
  };

  const checkEmailVerification = (user: firebase.User) => {
    const interval = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        clearInterval(interval);
        Alert.alert('Email Verified', 'Your email has been successfully verified.');
        setStage(3); // Proceed to phone verification
      }
    }, 5000); // Checks every 5 seconds
  };

  const sendPhoneOTP = async () => {
    try {
      setLoading(true);
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      if (!recaptchaVerifier.current) {
        setLoading(true);
        Alert.alert('Error', 'Recaptcha verifier is not initialized.');
        return;
    }    
      const verificationId = await phoneProvider.verifyPhoneNumber(userData.phone, recaptchaVerifier.current);
      setVerificationId(verificationId);
      Alert.alert('Verification Code Sent', 'A verification code has been sent to your phone.');
      setStage(4);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        if(error.message.includes("Invalid format")){
          Alert.alert(
              "OTP Error",
              "Invalid format. Please provide the OTP in correct format including the country code. Example: +917054204996"
            );
      }
      else{
      Alert.alert('OTP Error', error.message);
  }
      } else {
          Alert.alert('Error', 'An unknown error occurred.');
      }
  }
  
  };

  const verifyPhoneOTP = async () => {
    try {
      setLoading(true);
      if(!verificationId){
        Alert.alert('Error','Something went wrong');
        setLoading(false);
        return;
      }
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      const response = await firebase.auth().signInWithCredential(credential);
      await firebase.firestore().collection('users').doc(response.user?.uid).set(userData);
      Alert.alert('Phone Verified', 'Your phone number has been successfully verified. Thank you for signing up!', [
        { text: "OK", onPress: () => navigation.navigate('SignIn') }
      ]);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
          Alert.alert('Error', error.message);
      } else {
          Alert.alert('Error', 'An unknown error occurred.');
      }
  }
  };
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
        attemptInvisibleVerification={true}
      />
      {stage === 1 && (
        <>
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#ccc" value={userData.name} onChangeText={(text) => handleInputChange('name', text)} />
          <View style={styles.inputWrapper}>
            <Text onPress={() => setDatePickerVisibility(true)} style={styles.inputText}>
              
            {userData.dob? new Date(userData.dob).toDateString() : "Date of Birth"}
            </Text>
          </View>
          {isDatePickerVisible && (
        <DateTimePicker
          value={userData.dob || new Date()} // Set the initial value to the selected date or today's date
          mode="date"
          display="spinner" // Set the display mode to spinner
          onChange={handleDateChange}
        />
      )}

          <View style={styles.inputWrapper}>
            <Picker
              selectedValue={userData.gender}
              onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
              style={styles.picker}
              itemStyle={styles.inputText} // Apply text style to picker items
            >
              <Picker.Item label="Gender" value="Gender" enabled={false} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Non-Binary" value="Non-Binary" />
              <Picker.Item label="Something else" value="Something else" />
              <Picker.Item label="Prefer not to say" value="Prefer not to say" />
            </Picker>
          </View>
          <View style={styles.inputWrapper}>
            <Picker
              selectedValue={userData.userType}
              onValueChange={(itemValue) => handleInputChange('userType', itemValue)}
              style={styles.picker}
              itemStyle={styles.inputText} // Apply text style to picker items
            >
              <Picker.Item label="Type" value="Type" enabled={false} />
              <Picker.Item label="Fan" value="Fan" />
              <Picker.Item label="Artist" value="Artist" />
            </Picker>
          </View>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" value={userData.email} onChangeText={(text) => handleInputChange('email', text)} keyboardType="email-address" />
          <View>
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#ccc" 
              value={userData.password} 
              onChangeText={(text) => handleInputChange('password', text)} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => togglePasswordVisibility('password')}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput 
              style={styles.input} 
              placeholder="Confirm Password" 
              placeholderTextColor="#ccc" 
              value={userData.confirmPassword} 
              onChangeText={(text) => handleInputChange('confirmPassword', text)} 
              secureTextEntry={!showConfirmPassword} 
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => togglePasswordVisibility('confirmPassword')}
            >
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleEmailRegistration}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Email</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {stage === 2 && (
        <Text style={styles.text}>Please verify your email to continue. Check your email inbox for the verification link.</Text>
      )}
      {stage === 3 && (
        <>
          <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#ccc" value={userData.phone} onChangeText={(text) => handleInputChange('phone', text)} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={sendPhoneOTP}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Phone OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {stage === 4 && (
        <>
          <TextInput style={styles.input} placeholder="Enter Phone OTP" placeholderTextColor="#ccc" value={verificationCode} onChangeText={setVerificationCode} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={verifyPhoneOTP}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {stage === 5 && (
        <Text style={styles.text}>Registration complete! Thank you for registering.</Text>
      )}
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark background for the whole container
  },
  inputWrapper: {
    height: 50,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  
  inputText: {
    color: '#ccc', // Subdued color to match placeholder text
    fontSize: 16,
    
  },
  input: {
    height: 50,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    color: '#ccc',
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 5,
  },

  button: {
    backgroundColor: '#1a73e8',
    padding: 12,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Ensure the buttons have a consistent height with inputs
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  picker: {
    flex: 1,
    color: '#ccc', // White text color for the options
    margin: -15,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 8,
  }
});

export default SignUpScreen;
