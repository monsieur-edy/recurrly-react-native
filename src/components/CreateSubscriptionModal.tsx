import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import {
    SUBSCRIPTION_CATEGORIES,
    SUBSCRIPTION_CATEGORY_COLORS,
    type SubscriptionCategory,
} from "@/constants/data";
import { icons } from "@/constants/icons";

type SubscriptionFrequency = "Monthly" | "Yearly";

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({ visible, onClose, onCreate }: CreateSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<SubscriptionFrequency>("Monthly");
    const [category, setCategory] = useState<SubscriptionCategory>(SUBSCRIPTION_CATEGORIES[0]);
    const parsedPrice = Number(price.trim());
    const isValid = name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

    const handleSubmit = () => {
        if (!isValid) {
            return;
        }

        const startDate = dayjs();
        const renewalDate = startDate.add(1, frequency === "Monthly" ? "month" : "year");

        onCreate({
            id: `new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            name: name.trim(),
            price: parsedPrice,
            frequency,
            category,
            status: "active",
            startDate: startDate.toISOString(),
            renewalDate: renewalDate.toISOString(),
            icon: icons.wallet,
            billing: frequency,
            color: SUBSCRIPTION_CATEGORY_COLORS[category],
        });

        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory(SUBSCRIPTION_CATEGORIES[0]);
        onClose();
    };

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View className="modal-overlay">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1, justifyContent: "flex-end" }}
                >
                    <View className="modal-container">
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Close modal"
                                className="modal-close"
                                onPress={onClose}
                            >
                                <Text className="modal-close-text">×</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            className="flex-1"
                            contentContainerClassName="modal-body"
                            keyboardShouldPersistTaps="handled"
                        >
                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    accessibilityLabel="Subscription name"
                                    className="auth-input"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Streaming service"
                                    placeholderTextColor="#666666"
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    accessibilityLabel="Subscription price"
                                    className="auth-input"
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="0.00"
                                    placeholderTextColor="#666666"
                                    keyboardType="decimal-pad"
                                    returnKeyType="done"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    {(["Monthly", "Yearly"] as const).map((option) => {
                                        const isActive = frequency === option;

                                        return (
                                            <Pressable
                                                key={option}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected: isActive }}
                                                className={clsx("picker-option", isActive && "picker-option-active")}
                                                onPress={() => setFrequency(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        "picker-option-text",
                                                        isActive && "picker-option-text-active",
                                                    )}
                                                >
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {SUBSCRIPTION_CATEGORIES.map((option) => {
                                        const isActive = category === option;

                                        return (
                                            <Pressable
                                                key={option}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected: isActive }}
                                                className={clsx("category-chip", isActive && "category-chip-active")}
                                                onPress={() => setCategory(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        "category-chip-text",
                                                        isActive && "category-chip-text-active",
                                                    )}
                                                >
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityState={{ disabled: !isValid }}
                                className={clsx("auth-button", !isValid && "auth-button-disabled")}
                                disabled={!isValid}
                                onPress={handleSubmit}
                            >
                                <Text className="auth-button-text">Create Subscription</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default CreateSubscriptionModal;