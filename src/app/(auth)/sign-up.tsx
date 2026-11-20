import {useState} from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {useSignUp} from '@clerk/expo';
import {Link, router} from 'expo-router';
import clsx from 'clsx';

const SafeArea = styled(SafeAreaView);

export default function SignUp() {
    const {signUp} = useSignUp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [codeError, setCodeError] = useState('');

    const validateName = (value: string) => {
        if (!value.trim()) {
            setNameError('Name is required');
            return false;
        }
        setNameError('');
        return true;
    };

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
        if (value.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateCode = (value: string) => {
        if (!value.trim()) {
            setCodeError('Verification code is required');
            return false;
        }
        setCodeError('');
        return true;
    };

    const handleSignUp = async () => {
        setError('');
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isNameValid || !isEmailValid || !isPasswordValid) return;

        setLoading(true);
        try {
            const {error: passwordError} = await signUp.password({
                emailAddress: email,
                password,
                firstName: name,
            });
            if (passwordError) {
                setError(passwordError.message || 'Something went wrong. Please try again.');
                return;
            }

            const {error: sendError} = await signUp.verifications.sendEmailCode();
            if (sendError) {
                setError(sendError.message || 'Failed to send verification code.');
                return;
            }

            setIsVerifying(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError('');
        const isCodeValid = validateCode(code);
        if (!isCodeValid) return;

        setLoading(true);
        try {
            const {error: verifyError} = await signUp.verifications.verifyEmailCode({code});
            if (verifyError) {
                setError(verifyError.message || 'Invalid verification code.');
                return;
            }

            const {error: finalizeError} = await signUp.finalize();
            if (finalizeError) {
                setError(finalizeError.message || 'Something went wrong. Please try again.');
                return;
            }

            router.replace('/(tabs)');
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
                        <Text className="auth-title">Create account</Text>
                        <Text className="auth-subtitle">
                            {isVerifying
                                ? 'Check your email for the verification code'
                                : 'Start managing your subscriptions today'
                            }
                        </Text>

                        {/* Form Card */}
                        <View className="auth-card">
                            <View className="auth-form">

                                {isVerifying ? (
                                    /* Verification Code */
                                    <>
                                        <View className="auth-field">
                                            <Text className="auth-label">Verification code</Text>
                                            <Text className="auth-helper">
                                                We sent a code to {email}
                                            </Text>
                                            <TextInput
                                                className={clsx('auth-input', codeError && 'auth-input-error')}
                                                placeholder="Enter the code"
                                                placeholderTextColor="rgba(0,0,0,0.4)"
                                                value={code}
                                                onChangeText={(text) => {
                                                    setCode(text);
                                                    if (codeError) validateCode(text);
                                                }}
                                                keyboardType="numeric"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                editable={!loading}
                                            />
                                            {codeError ? <Text className="auth-error">{codeError}</Text> : null}
                                        </View>

                                        <Pressable
                                            className={clsx('auth-button', loading && 'auth-button-disabled')}
                                            onPress={handleVerify}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#fff9e3" />
                                            ) : (
                                                <Text className="auth-button-text">Verify</Text>
                                            )}
                                        </Pressable>

                                        <Pressable
                                            className="auth-secondary-button"
                                            onPress={() => setIsVerifying(false)}
                                            disabled={loading}
                                        >
                                            <Text className="auth-secondary-button-text">
                                                Use a different email
                                            </Text>
                                        </Pressable>
                                    </>
                                ) : (
                                    /* Sign Up Form */
                                    <>
                                        {/* Name */}
                                        <View className="auth-field">
                                            <Text className="auth-label">Name</Text>
                                            <TextInput
                                                className={clsx('auth-input', nameError && 'auth-input-error')}
                                                placeholder="Enter your name"
                                                placeholderTextColor="rgba(0,0,0,0.4)"
                                                value={name}
                                                onChangeText={(text) => {
                                                    setName(text);
                                                    if (nameError) validateName(text);
                                                }}
                                                autoCapitalize="words"
                                                autoCorrect={false}
                                                editable={!loading}
                                            />
                                            {nameError ? <Text className="auth-error">{nameError}</Text> : null}
                                        </View>

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
                                                placeholder="Create a password"
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
                                            {!passwordError && password.length > 0 && (
                                                <Text className="auth-helper">
                                                    At least 8 characters
                                                </Text>
                                            )}
                                        </View>

                                        {/* Bot protection */}
                                        <View nativeID="clerk-captcha" />

                                        {/* Error */}
                                        {error ? <Text className="auth-error">{error}</Text> : null}

                                        {/* Sign Up Button */}
                                        <Pressable
                                            className={clsx('auth-button', loading && 'auth-button-disabled')}
                                            onPress={handleSignUp}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#fff9e3" />
                                            ) : (
                                                <Text className="auth-button-text">Create account</Text>
                                            )}
                                        </Pressable>
                                    </>
                                )}

                                {/* Divider */}
                                <View className="auth-divider-row">
                                    <View className="auth-divider-line" />
                                    <Text className="auth-divider-text">or</Text>
                                    <View className="auth-divider-line" />
                                </View>

                                {/* Sign in link */}
                                <View className="auth-link-row">
                                    <Text className="auth-link-copy">Already have an account?</Text>
                                    <Link href="/(auth)/sign-in" asChild>
                                        <Pressable>
                                            <Text className="auth-link">Sign in</Text>
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