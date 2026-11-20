import {useState} from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {useSignIn} from '@clerk/expo';
import {Link, router} from 'expo-router';
import clsx from 'clsx';

const SafeArea = styled(SafeAreaView);

export default function SignIn() {
    const {signIn} = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (value: string) => {
        if (!value.trim()) {
            setEmailError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (value: string) => {
        if (!value) {
            setPasswordError('Password is required');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSignIn = async () => {
        setError('');
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) return;

        setLoading(true);
        try {
            const {error} = await signIn.password({emailAddress: email, password});
            if (error) {
                setError('Invalid email or password. Please try again.');
                return;
            }
            await signIn.finalize({
                navigate: () => {
                    router.replace('/(tabs)');
                }
            });
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeArea className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <ScrollView className="auth-scroll" contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <View className="auth-content">

                        {/* Brand */}
                        <View className="auth-brand-block items-start">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">Smart Billing</Text>
                                </View>
                            </View>
                        </View>

                        {/* Title */}
                        <Text className="auth-title">Welcome back</Text>
                        <Text className="auth-subtitle">
                            Sign in to continue managing your subscriptions
                        </Text>

                        {/* Form Card */}
                        <View className="auth-card">
                            <View className="auth-form">

                                {/* Email */}
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        className={clsx('auth-input', emailError && 'auth-input-error')}
                                        placeholder="Enter your email"
                                        placeholderTextColor="rgba(0,0,0,0.4)"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (emailError) validateEmail(text);
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!loading}
                                    />
                                    {emailError ? <Text className="auth-error">{emailError}</Text> : null}
                                </View>

                                {/* Password */}
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className={clsx('auth-input', passwordError && 'auth-input-error')}
                                        placeholder="Enter your password"
                                        placeholderTextColor="rgba(0,0,0,0.4)"
                                        value={password}
                                        secureTextEntry
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (passwordError) validatePassword(text);
                                        }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!loading}
                                    />
                                    {passwordError ? <Text className="auth-error">{passwordError}</Text> : null}
                                </View>

                                {/* Error */}
                                {error ? <Text className="auth-error">{error}</Text> : null}

                                {/* Sign In Button */}
                                <Pressable
                                    className={clsx('auth-button', loading && 'auth-button-disabled')}
                                    onPress={handleSignIn}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff9e3" />
                                    ) : (
                                        <Text className="auth-button-text">Sign in</Text>
                                    )}
                                </Pressable>

                                {/* Divider */}
                                <View className="auth-divider-row">
                                    <View className="auth-divider-line" />
                                    <Text className="auth-divider-text">or</Text>
                                    <View className="auth-divider-line" />
                                </View>

                                {/* Sign up link */}
                                <View className="auth-link-row">
                                    <Text className="auth-link-copy">New to Recurly?</Text>
                                    <Link href="/(auth)/sign-up" asChild>
                                        <Pressable>
                                            <Text className="auth-link">Create an account</Text>
                                        </Pressable>
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeArea>
    );
}