import {View, Text} from 'react-native';
import React from 'react';
import {Link, useLocalSearchParams} from "expo-router";

const SubscriptionDetails = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-xl font-bold text-success">Subscription Details : {id}</Text>
            <Link href="/">Home</Link>
        </View>
    );
};

export default SubscriptionDetails;