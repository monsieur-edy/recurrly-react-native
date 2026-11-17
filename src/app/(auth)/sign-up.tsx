import {View, Text} from 'react-native';
import React from 'react';
import {Link} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>SignUP</Text>
            <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Log in</Link>
        </View>
    );
};

export default SignUp;