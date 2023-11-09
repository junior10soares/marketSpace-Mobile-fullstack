import { MyCard } from "@components/MyCard";
import { CardDTO } from "@dtos/CardDTO";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { HStack, Heading, Text, Center, useToast, FlatList, VStack, View } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

type PropsImg = {
    product_id: string
    path: string
}

export function MyAds() {

    const toast = useToast()

    const [qntd, setQntd] = useState<string>('')
    const [products, setProducts] = useState<CardDTO[]>([])
    const [img, setImg] = useState<PropsImg[]>([])

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await api.get('/users/products');
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
            }
        }
        fetchProduct();
    }, []);

    async function fetchImg() {
        try {
            console.log('oi')

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o usuário';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    return (
        <VStack p={23} bg='gray.600' flex={1}>
            <Center mt={36} pb={31}>
                <TouchableOpacity onPress={fetchImg}>
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
                                price={item.price}
                                is_new={item.is_new}
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