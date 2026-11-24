import "../../global.css"
import {FlatList, Image, Pressable, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  return (
      <SafeAreaView className="flex-1 bg-background p-5">



              <FlatList
                  ListHeaderComponent={() => (
                      <>
                          <View className="home-header">
                              <View className="home-user">
                                  <Image className="home-avatar" source={images.avatar}></Image>
                                  <Text className="home-user-name font-bold">{HOME_USER.name}</Text>
                              </View>

                              <Pressable
                                  accessibilityRole="button"
                                  accessibilityLabel="Create subscription"
                                  onPress={() => setIsCreateModalVisible(true)}
                              >
                                  <Image className="home-add-icon" source={icons.add}></Image>
                              </Pressable>
                          </View>

                          <View className="home-balance-card">
                              <Text className="home-balance-label">Balance</Text>
                              <View className="home-balance-row">
                                  <Text className="home-balance-amount">
                                      {formatCurrency(HOME_BALANCE.amount)}
                                  </Text>
                                  <Text className="home-balance-date">
                                      {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                  </Text>
                              </View>
                          </View>

                          <View>
                              <ListHeading title="Upcoming" />
                              <FlatList
                                  data={UPCOMING_SUBSCRIPTIONS}
                                  renderItem={({ item }) => ( <UpcomingSubscriptionCard {...item} /> )}
                                  keyExtractor={(item) => item.id}
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                              />
                          </View>

                          <ListHeading title="All subscriptions" />
                      </>
                  )}
                  data={subscriptions}
                  renderItem={({ item }) => (
                      <SubscriptionCard
                          {...item}
                          expanded={expandedSubscriptionId === item.id}
                          onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}                      />
                  )}
                  keyExtractor={(item) => item.id}
                  extraData={expandedSubscriptionId}
                  ItemSeparatorComponent={() => <View className="h-4" />}
                  ListEmptyComponent={<Text className="home-empty-state">No subscription yet.</Text>}
                  contentContainerClassName="pb-20"
              />
          <CreateSubscriptionModal
              visible={isCreateModalVisible}
              onClose={() => setIsCreateModalVisible(false)}
              onCreate={(subscription) => setSubscriptions((currentSubscriptions) => [subscription, ...currentSubscriptions])}
          />
      </SafeAreaView>
  );
}
