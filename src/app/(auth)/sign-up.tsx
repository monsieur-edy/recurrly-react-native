import {useAuth} from '@clerk/expo';
import {useHostedAuth} from '@clerk/expo/hosted-auth';
import {Link} from 'expo-router';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';

export default function SignUp() {
  const {isLoaded} = useAuth();
  const {startHostedAuth} = useHostedAuth();

  const handleSignUp = async () => {
    try {
      await startHostedAuth({mode: 'sign-up'});
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Button title="Sign up" onPress={handleSignUp} />
      <Link href="/(auth)/sign-in" style={styles.link}>
        Already have an account? Sign in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  link: {
    color: '#208AEF',
    fontSize: 16,
    marginTop: 12,
  },
});