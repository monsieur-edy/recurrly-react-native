import {FlatList, Pressable, Text, TextInput, View} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import {useMemo, useState} from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import {HOME_SUBSCRIPTIONS} from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView)

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const filteredSubscriptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return HOME_SUBSCRIPTIONS;
        }

        return HOME_SUBSCRIPTIONS.filter((subscription) =>
            [subscription.name, subscription.category, subscription.plan]
                .some((value) => value?.toLowerCase().includes(query)),
        );
    }, [searchQuery]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="mb-6">
                <Text className="text-3xl font-sans-bold text-primary">Subscriptions</Text>
                <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
                    Search and manage your recurring payments.
                </Text>
            </View>

            <View className="mb-5 flex-row items-center rounded-2xl border border-border bg-card px-4">
                <TextInput
                    accessibilityLabel="Search subscriptions"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="h-14 flex-1 text-base text-primary"
                    onChangeText={setSearchQuery}
                    placeholder="Search subscriptions"
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    returnKeyType="search"
                    value={searchQuery}
                />
                {searchQuery.length > 0 && (
                    <Pressable
                        accessibilityLabel="Clear search"
                        accessibilityRole="button"
                        className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-muted"
                        onPress={() => setSearchQuery("")}
                    >
                        <Text className="text-xl text-primary">×</Text>
                    </Pressable>
                )}
            </View>

            <FlatList
                className="flex-1"
                contentContainerClassName="pb-28"
                data={filteredSubscriptions}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={(
                    <Text className="text-center text-base font-sans-medium text-muted-foreground">
                        {searchQuery.trim() ? "No subscriptions match your search." : "No subscriptions yet."}
                    </Text>
                )}
                ListHeaderComponent={(
                    <View className="mb-4 flex-row items-center justify-between">
                        <Text className="text-xl font-sans-bold text-primary">All subscriptions</Text>
                        <Text className="text-sm font-sans-medium text-muted-foreground">
                            {filteredSubscriptions.length}
                        </Text>
                    </View>
                )}
                renderItem={({item}) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => setExpandedSubscriptionId((currentId) =>
                            currentId === item.id ? null : item.id,
                        )}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Subscriptions;