import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {formatCurrency, formatStatusLabel, formatSubscriptionDateTime} from "@/lib/utils";
import clsx from "clsx";
import text from "react-native-css/components/Text";

const SubscriptionCard = ({name, price, currency, category, plan, renewalDate,
                              icon, billing, color, expanded, onPress, paymentMethod, startDate, status} : SubscriptionCardProps) => {
    const fallback = 'Not provided';
    return (
        <Pressable onPress={onPress} className={clsx('sub-card', expanded? 'sub-card-expanded': 'bg-card')}
                   style={!expanded && color? {backgroundColor: color}: undefined} >
            <View className="sub-head">
                <View className="sub-main">
                    <Image className="sub-icon" source={icon}></Image>
                    <View className="sub-copy">
                        <Text className="sub-title" numberOfLines={1}>{name}</Text>
                        <Text className="sub-meta" numberOfLines={1} ellipsizeMode="tail">
                            { category?.trim() || plan?.trim() ||
                                (renewalDate ? formatSubscriptionDateTime(renewalDate): '') }
                        </Text>
                    </View>
                </View>
            </View>

            {expanded && (
                <View className="sub-body">
                    <View className="sub-details">
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{paymentMethod?.trim() || fallback}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Category:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{category?.trim() || plan?.trim() || fallback}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{startDate? formatSubscriptionDateTime(startDate): fallback}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{renewalDate? formatSubscriptionDateTime(renewalDate): fallback}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{status? formatStatusLabel(status): fallback}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            )}

            <View className="sub-price-box">
                <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                <Text className="sub-billing">{billing}</Text>
            </View>
        </Pressable>
    );
};

export default SubscriptionCard;