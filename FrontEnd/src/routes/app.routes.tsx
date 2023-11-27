import { useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Alert, Platform, Pressable } from 'react-native';

import { House, Tag, SignOut as Leave } from 'phosphor-react-native';

import { MyAds } from '@screens/MyAds';
import { Home } from '@screens/Home';
import { SignIn } from '@screens/SignIn';
import { Details } from '@screens/Details';
import { NewAds } from '@screens/NewAds';
import { DetailsMyAds } from '@screens/DetailsMyAds';
import { useAuth } from '@hooks/useAuth';
import { PropsDetails } from '@components/MyCard';
import { PropsCard } from '@components/Card';

export type AppRoutes = {
    home: undefined;
    myads: undefined
    logout: undefined;
    details: { details: PropsCard }
    newAds: undefined;
    detailsMyAds: { details: PropsDetails }
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator: BottomTabNavigator, Screen: BottomTabScreen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
    const { sizes, colors } = useTheme();
    const iconSize = sizes[6];
    const { signOut } = useAuth()

    return (
        <BottomTabNavigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.gray[100],
            tabBarStyle: {
                backgroundColor: colors.gray[700],
                borderTopWidth: 0,
                height: Platform.OS === "android" ? 'auto' : 96,
                paddingBottom: sizes[10],
                paddingTop: sizes[6]
            }
        }}>
            <BottomTabScreen
                name='home'
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <House size={iconSize} color={color} />
                    )
                }}
            />
            <BottomTabScreen
                name='myads'
                component={MyAds}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Tag size={iconSize} color={color} />
                    )
                }}
            />
            <BottomTabScreen
                name='logout'
                component={SignIn}
                options={{
                    tabBarIcon: () => (
                        <Pressable
                            onPress={() => {
                                Alert.alert(
                                    'Sair',
                                    'Tem certeza que deseja sair?',
                                    [
                                        {
                                            text: 'Cancelar',
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Sair',
                                            onPress: () => {
                                                signOut();
                                            }
                                        }
                                    ]
                                );
                            }}
                            style={{ marginBottom: -1 }}
                        >
                            <Leave size={iconSize} color={colors.red[700]} />
                        </Pressable>
                    )
                }}
            />
            < BottomTabScreen
                name='details'
                component={Details}
                options={{ tabBarButton: () => null }}
            />
            < BottomTabScreen
                name='newAds'
                component={NewAds}
                options={{ tabBarButton: () => null }}
            />
            < BottomTabScreen
                name='detailsMyAds'
                component={DetailsMyAds}
                options={{ tabBarButton: () => null }}
            />
        </BottomTabNavigator >
    );
}
