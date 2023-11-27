import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Flex, HStack, Icon, Input, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { ArrowRight, MagnifyingGlass, Tag } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { ImageSourcePropType, TouchableOpacity } from "react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Button } from "@components/Button";
import { Card, PropsCard } from "@components/Card";
import { UserPhoto } from "@components/UserPhoto";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { UserDTO } from "@dtos/UserDTO";
import { CardDTOStatic } from "@dtos/CardDTOStatic";

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

export function Home() {

    const [products, setProducts] = useState<CardDTOStatic[]>([
        {
            id: 1,
            name: "Bicicleta",
            nameFirst: 'José',
            avatar: perfil as ImageSourcePropType,
            is_new: true,
            price: "970",
            imgAds: bike,
        },
        {
            id: 2,
            name: "Sofa",
            nameFirst: 'Aline',
            avatar: perfil1 as ImageSourcePropType,
            is_new: true,
            price: "500,99",
            imgAds: sofa
        },
        {
            id: 3,
            name: "Luminaria",
            nameFirst: 'João',
            avatar: perfil2 as ImageSourcePropType,
            is_new: true,
            price: "99,99",
            imgAds: luminaria
        },
        {
            id: 4,
            name: "Tenis Vermelho",
            nameFirst: 'Joaquim',
            avatar: perfil3 as ImageSourcePropType,
            is_new: true,
            price: "199,99",
            imgAds: tenis
        },
        {
            id: 5,
            name: "Tenis Cinza",
            nameFirst: 'Joana',
            avatar: perfil4 as ImageSourcePropType,
            is_new: true,
            price: "51,57",
            imgAds: tenisdois
        },
        {
            id: 6,
            name: "Comoda",
            nameFirst: 'Matheus',
            avatar: perfil5 as ImageSourcePropType,
            is_new: true,
            price: "274,99",
            imgAds: comoda
        },
        {
            id: 7,
            name: "Camisa",
            nameFirst: 'Mari',
            avatar: perfil6 as ImageSourcePropType,
            is_new: true,
            price: "89,99",
            imgAds: camisa
        },
    ])
    const [filteredProducts, setFilteredProducts] = useState<CardDTOStatic[]>([]);
    const [productsUser, setProductsUser] = useState<CardDTOStatic[]>([])
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const combinedProducts = [...products, ...productsUser]
    const [qntd, setQntd] = useState<string>('')
    const toast = useToast()
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const [searchTerm, setSearchTerm] = useState('');

    const [user, setUser] = useState<Pick<UserDTO, 'avatar' | 'name'>>({
        avatar: '',
        name: '',
    });

    function handleGoNewAds() {
        navigation.navigate('newAds')
    }

    function handleGoDetails(cardInfo: PropsCard) {
        navigation.navigate('details', { details: cardInfo })
    }

    function handleMyAds() {
        navigation.navigate('myads')
    }

    function getDynamicImageSource(product: CardDTOStatic): ImageSourcePropType | undefined {
        if (product.imgAds) {
            return product.imgAds;
        } else if (typeof product.product_images?.[0]?.path === 'string') {
            return { uri: `${api.defaults.baseURL}/images/${product.product_images[0].path}` };
        }
        return undefined;
    }

    function filterProducts(text: string) {
        setSearchTerm(text);
        if (text === '') {
            setFilteredProducts(combinedProducts);
        } else {
            const filtered = combinedProducts.filter(product =>
                product.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                try {
                    const response = await api.get('/users/products');
                    const userProducts = response.data;
                    setQntd(userProducts.length);
                    setProductsUser(userProducts);
                    setFilteredProducts([...products, ...userProducts])
                } catch (error) {
                    const isAppError = error instanceof AppError;
                    const title = isAppError
                        ? error.message
                        : 'Não foi possível carregar os produtos do usuário';
                    toast.show({
                        title,
                        placement: 'top',
                        bgColor: 'red.500',
                    });
                }
            }
            fetchData()
        }, [products])
    );

    useEffect(() => {
        setPhotoIsLoading(true)

        async function fetchUsers() {
            try {
                const response = await api.get('/users/me');
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
                })
            } finally {
                setPhotoIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    return (
        <ScrollView bg='gray.600' contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack p={25} mt={10}>
                <HStack>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={45}
                                h={45}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                            :
                            user?.avatar && (
                                <UserPhoto
                                    source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
                                    alt="Foto do perfil"
                                    size={45}
                                />
                            )
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
                    onChangeText={text => filterProducts(text)}
                    rightElement={
                        <Icon as={MagnifyingGlass} />
                    }
                />
                <Flex direction="row" flexWrap="wrap" alignItems='center' mt={4}>
                    {filteredProducts.map((product) => (
                        <TouchableOpacity key={product.id}>
                            <Card
                                title={product.name}
                                avatar={product.avatar || `${api.defaults.baseURL}/images/${user.avatar}`}
                                is_new={product.is_new}
                                nameFirts={product.nameFirst}
                                price={`R$ ${product.price}`}
                                imgAds={getDynamicImageSource(product)}
                                onPress={() => handleGoDetails({
                                    avatar: product.avatar || `${api.defaults.baseURL}/images/${user.avatar}`,
                                    title: product.name,
                                    price: product.price,
                                    nameFirts: product.nameFirst,
                                    is_new: product.is_new,
                                    imgAds: getDynamicImageSource(product),
                                })}
                            />
                        </TouchableOpacity>
                    ))}
                </Flex>
            </VStack>
        </ScrollView>
    )
}