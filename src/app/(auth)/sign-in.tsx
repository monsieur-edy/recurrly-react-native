import {useAuth} from '@clerk/expo';
import {useHostedAuth} from '@clerk/expo/hosted-auth';
import {Link} from 'expo-router';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';

export default function SignIn() {
  const {isLoaded} = useAuth();
  const {startHostedAuth} = useHostedAuth();

  const handleSignIn = async () => {
    try {
      await startHostedAuth({mode: 'sign-in'});
    } catch (error) {
      console.error('Sign in error:', error);
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
      <Text style={styles.title}>Sign in</Text>
      <Button title="Sign in" onPress={handleSignIn} />
      <Link href="/(auth)/sign-up" style={styles.link}>
        Don&apos;t have an account? Sign up
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