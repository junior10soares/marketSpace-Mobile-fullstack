import React, { useEffect, useState } from "react";
import { Box, HStack, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "phosphor-react-native";

import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { PropsDetails } from "@components/MyCard";
import { AppError } from "@utils/AppError";
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Loading } from "@components/Loading";

export function DetailsMyAds() {

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const [buttonVariant, setButtonVariant] = useState('blue');
    const [titleVariant, setTitleVariant] = useState('');
    const [showAdInactive, setShowAdInactive] = useState(true);
    const [imageBlur, setImageBlur] = useState(10);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { user } = useAuth();
    const toast = useToast();

    const { id, imgAds, active, is_new, title, price, description } = (route.params as { details?: PropsDetails })?.details || {};

    function handlePress() {
        navigation.navigate('myads');
    }

    async function handleToggleAdStatus() {
        setLoading(true)
        try {
            await api.patch(`/products/${id}`, { is_active: !active });
            setButtonVariant((prevVariant) => (prevVariant === 'black' ? 'blue' : 'black'));
            setTitleVariant((prevVariant) => (prevVariant === 'Desativar anúncio' ? 'Ativar Anúncio' : 'Desativar anúncio'));
            setShowAdInactive((prevShowAdInactive) => !prevShowAdInactive);
            setImageBlur((prevShowAdInactive) => (prevShowAdInactive ? 0 : 10));
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível alterar o status do anúncio';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500',
            });
        } finally {
            setLoading(false)
        }
    }

    async function deleteProduct() {
        try {
            Alert.alert(
                'Confirmação',
                'Tem certeza que deseja excluir este item?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        onPress: async () => {
                            await api.delete(`/products/${id}`);
                            navigation.navigate('myads');
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível excluir o anúncio';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    if (!id) {
        return (
            <ScrollView bg="gray.600" flex={1}>
                <Text color="red.500">Detalhes do anúncio não encontrados.</Text>
            </ScrollView>
        );
    }

    useEffect(() => {
        const newTitleVariant = active ? 'Desativar anúncio' : 'Ativar Anúncio';
        const newButtonVariant = active ? 'blue' : 'black';
        const newImageBlur = active ? 0 : 10;
        const newShowAdInactive = !active;

        setTitleVariant(newTitleVariant);
        setButtonVariant(newButtonVariant);
        setImageBlur(newImageBlur);
        setShowAdInactive(newShowAdInactive);
    }, [active]);

    return (
        <ScrollView bg='gray.600' flex={1}>
            <Box mt={36} p={23}>
                <TouchableOpacity onPress={handlePress}>
                    <ArrowLeft />
                </TouchableOpacity>
            </Box>
            {loading ? (
                <Loading />
            ) : (
                <Image
                    alt="img product"
                    source={{ uri: `${api.defaults.baseURL}/images/${imgAds}` }}
                    w={'100%'}
                    h={280}
                    blurRadius={imageBlur}
                />
            )}
            {showAdInactive && (
                <Text position={'absolute'} fontWeight={'bold'} fontSize={'sm'} color={'gray.700'} left={120} top={240}>
                    Anúncio desativado
                </Text>
            )}
            <HStack p={23}>
                {loading ? (
                    <Loading />
                ) : (
                    <UserPhoto size={23} alt="img do profile" source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }} />
                )}
                <Text ml={3} fontSize={'sm'} color={'gray.100'}>{user.name}</Text>
            </HStack>
            <VStack ml={23}>
                <Text
                    bg={'gray.500'}
                    h={17}
                    w={43}
                    textAlign='center'
                    color='gray.200'
                    fontWeight='bold'
                    fontSize={10}
                    rounded="full">
                    {is_new ? 'NOVO' : 'USADO'}
                </Text>
                <HStack justifyContent={'space-between'} alignItems={'center'} mr={23} mt={3}>
                    <Text fontSize='xl' fontWeight={'bold'} color={'gray.100'}>{title}</Text>
                    <Text color={'blue.500'} fontSize='xl' fontWeight={'bold'}>R$ {price}</Text>
                </HStack>
                <Text mt={2} pb={20}>
                    {description}
                </Text>
                <Button
                    title={titleVariant}
                    w={327}
                    variant={buttonVariant}
                    mt={2}
                    onPress={handleToggleAdStatus}
                />
                <Button
                    title="Excluir anúncio"
                    w={327}
                    variant='gray'
                    mt={2}
                    onPress={deleteProduct}
                />
            </VStack>
        </ScrollView>
    );
}
