import { Loading } from "@components/Loading";
import { MyCard, PropsDetails } from "@components/MyCard";
import { CardDTO } from "@dtos/CardDTO";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError"

import { HStack, Heading, Text, Center, useToast, FlatList, VStack, View } from "native-base";
import { useCallback, useState } from "react"
import { TouchableOpacity } from "react-native"

export function MyAds() {

    const toast = useToast()

    const [qntd, setQntd] = useState<string>('')
    const [products, setProducts] = useState<CardDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleCardPress(cardInfo: PropsDetails) {
        navigation.navigate('detailsMyAds', { details: cardInfo })
    }

    async function fetchProduct() {
        try {
            const response = await api.get('/users/products')
            setQntd(response.data.length)
            setProducts(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o usuário';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchProduct()
    }, []))

    if (isLoading) {
        return <Loading />;
    }

    return (
        <VStack p={23} bg='gray.600' flex={1}>
            <Center mt={36} pb={31}>
                <TouchableOpacity>
                    <Heading fontWeight={'bold'} color={'gray.100'} fontSize='xl'>
                        Meus anúncios
                    </Heading>
                </TouchableOpacity>
            </Center>

            <HStack justifyContent={'space-between'} pb={21}>
                <Text>{qntd} anúncios</Text>
                <Text>Todos</Text>
            </HStack>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <MyCard
                                key={item.id}
                                title={item.name}
                                active={item.is_active}
                                price={item.price}
                                is_new={item.is_new}
                                description={item.description}
                                imgAds={item.product_images
                                    ? item.product_images.map((image) => {
                                        return `${api.defaults.baseURL}/images/${image.path}`
                                    })
                                    : []}
                                onPress={() => handleCardPress({
                                    id: item.id,
                                    active: item.is_active,
                                    title: item.name,
                                    price: item.price,
                                    is_new: item.is_new,
                                    description: item.description,
                                    imgAds: item.product_images?.[0]?.path || ''
                                })}
                            />
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há produtos cadastrados ainda. {'\n'}
                        Vamos cadastrar hoje?
                    </Text>
                )}
            />
        </VStack>
    )
}