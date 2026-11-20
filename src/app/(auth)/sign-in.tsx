import {useAuth} from '@clerk/expo';
import {useHostedAuth} from '@clerk/expo/hosted-auth';
import {Link} from 'expo-router';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@/constants/theme';
import images from '@/constants/images';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Image source={images.logo} style={styles.logo} />
          <View style={styles.logoText}>
            <Text style={styles.brandName}>Recurly</Text>
            <Text style={styles.brandSubtitle}>SMART BILLING</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue managing your subscriptions
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <Link href="/(auth)/sign-up" style={styles.footerLink}>
            <Text style={styles.footerText}>New to Recurly? </Text>
            <Text style={styles.footerLinkText}>Create an account</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 48,
    gap: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  logoText: {
    gap: 2,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    fontFamily: 'sans-regular',
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.mutedForeground,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: 4,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
  footerLinkText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
  },
});