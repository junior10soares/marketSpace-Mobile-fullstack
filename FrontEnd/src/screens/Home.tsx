import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Flex, HStack, Icon, Input, ScrollView, Text, VStack, useToast } from "native-base";
import { ArrowRight, MagnifyingGlass, Tag } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { ImageSourcePropType, TouchableOpacity } from "react-native";

import { CardDTO } from "@dtos/CardDTO";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { UserPhoto } from "@components/UserPhoto";

import bike from '@assets/bike.png'
import camisa from '@assets/camisa.png'
import comoda from '@assets/comoda.png'
import luminaria from '@assets/luminaria.png'
import sofa from '@assets/sofa.png'
import tenis from '@assets/tenis.png'
import tenisdois from '@assets/tenisdois.png'
import perfil from '@assets/perfil.jpeg'
import perfil1 from '@assets/perfil1.jpeg'
import perfil2 from '@assets/perfil2.jpeg'
import perfil3 from '@assets/perfil3.jpeg'
import perfil4 from '@assets/perfil4.jpeg'
import perfil5 from '@assets/perfil5.jpeg'
import perfil6 from '@assets/perfil6.jpeg'
import profile from '@assets/profile.png'
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UserDTO } from "@dtos/UserDTO";

export function Home() {

    const [products, setProducts] = useState<CardDTO[]>([
        {
            id: 1,
            title: "Bicicleta",
            name: 'José',
            avatar: perfil as ImageSourcePropType,
            is_new: true,
            price: "R$ 970",
            imgAds: bike
        },
        {
            id: 2,
            title: "Sofa",
            name: 'Aline',
            avatar: perfil1 as ImageSourcePropType,
            is_new: true,
            price: "R$ 500,99",
            imgAds: sofa
        },
        {
            id: 3,
            title: "Luminaria",
            name: 'João',
            avatar: perfil2 as ImageSourcePropType,
            is_new: true,
            price: "R$ 99,99",
            imgAds: luminaria
        },
        {
            id: 4,
            title: "Tenis Vermelho",
            name: 'Joaquim',
            avatar: perfil3 as ImageSourcePropType,
            is_new: true,
            price: "R$ 199,99",
            imgAds: tenis
        },
        {
            id: 5,
            title: "Tenis Cinza",
            name: 'Joana',
            avatar: perfil4 as ImageSourcePropType,
            is_new: true,
            price: "R$ 51,57",
            imgAds: tenisdois
        },
        {
            id: 6,
            title: "Comoda",
            name: 'Matheus',
            avatar: perfil5 as ImageSourcePropType,
            is_new: true,
            price: "R$ 274,99",
            imgAds: comoda
        },
        {
            id: 7,
            title: "Camisa",
            name: 'Mari',
            avatar: perfil6 as ImageSourcePropType,
            is_new: true,
            price: "R$ 89,99",
            imgAds: camisa
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<CardDTO[]>([])

    const [user, setUser] = useState<Pick<UserDTO, 'avatar' | 'name'>>({
        avatar: '',
        name: '',
    });
    const [qntd, setQntd] = useState<string>('')

    const toast = useToast()

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleGoNewAds() {
        navigation.navigate('newAds')
    }

    function handleGoDetails(product: CardDTO) {
        navigation.navigate('details', { product })
    }

    function handleMyAds() {
        navigation.navigate('myads')
    }

    function filterProducts(text: string) {
        setSearchTerm(text);
        if (text === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProducts(filtered)
        }
    }

    useEffect(() => {
        async function fetchQntProduct() {
            try {
                const response = await api.get('/users/products');
                setQntd(response.data.length)
            } catch (error) {
                const isAppError = error instanceof AppError;
                const title = isAppError ? error.message : 'Não foi possível carregar o usuário';
                toast.show({
                    title,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
        }
        fetchQntProduct()
    }, []);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get('/users/me');
                console.log(response.data.avatar)
                setUser({
                    avatar: response.data.avatar,
                    name: response.data.name
                })

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
        fetchUsers()
    }, []);

    return (

        <ScrollView bg='gray.600' contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack p={25} mt={10}>

                <HStack>
                    {
                        user.avatar ?
                            <UserPhoto
                                size={45}
                                alt="Foto do perfil"
                                source={{ uri: user.avatar }}
                            />
                            : null
                    }
                    <Text ml={4} flex={1}>
                        Boas vindas,{'\n'}

                        <Text fontWeight='bold'>{user.name}!</Text>

                    </Text>
                    <Button
                        onPress={handleGoNewAds}
                        size={140}
                        variant='black'
                        title=" Criar anúncio"
                    />
                </HStack>

                <Text mt={33} fontSize='sm' color='gray.300'>
                    Seus produtos anunciados para venda
                </Text>

                <HStack
                    mt={11}
                    alignItems="center"
                    px={15}
                    bg={"blue.500"}
                    style={{ opacity: 0.5 }}
                    h={66}
                    borderRadius={6}
                >
                    <Tag color='blue' />
                    <Text flex={1} fontSize='xs' color='gray.100' ml={2}>
                        {qntd} {'\n'}
                        anúncios ativos
                    </Text>
                    <TouchableOpacity onPress={(handleMyAds)}>
                        <Text fontWeight='bold' color="blue" fontSize='xs' mr={1}>
                            Meus anúncios
                        </Text>
                    </TouchableOpacity>
                    <ArrowRight size={16} color="blue" />
                </HStack>

                <Text mt={33} color='gray.300'>
                    Compre produtos variados
                </Text>

                <Input
                    h={45}
                    px={4}
                    flex={1}
                    borderWidth={0}
                    bg='gray.700'
                    mt={11}
                    placeholder="Buscar anúncio"
                    fontSize="md"
                    placeholderTextColor="gray.400"
                    _focus={{
                        bgColor: 'gray.700',
                        borderWidth: 1,
                        borderColor: 'gray.500'
                    }}
                    rightElement={
                        <Icon as={MagnifyingGlass} />
                    }
                    onChangeText={text => filterProducts(text)}
                />

                <Flex direction="row" flexWrap="wrap" alignItems='center' mt={4}>
                    {products.map((product) => (
                        <TouchableOpacity key={product.id} onPress={() => handleGoDetails(product)}>
                            <Card
                                title={product.title}
                                name={product.name}
                                avatar={product.avatar}
                                is_new={false}
                                price={product.price}
                                imgAds={product.imgAds}
                            />
                        </TouchableOpacity>
                    ))}
                </Flex>
            </VStack>
        </ScrollView>
    )
}