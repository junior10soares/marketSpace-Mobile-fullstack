import { Box, HStack, Image, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ArrowLeft } from "phosphor-react-native";

import imgProduct from '@assets/product.png'
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useState } from "react";

export function DetailsMyAds() {

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const [buttonVariant, setButtonVariant] = useState('blue');
    const [titleVariant, setTitleVariant] = useState('Ativar Anúncio');
    const [showAdInactive, setShowAdInactive] = useState(true);
    const [imageBlur, setImageBlur] = useState(0)

    function handlePress() {
        navigation.goBack()
    }

    function handleActiveouDesactivAds() {
        setButtonVariant((prevVariant) => (prevVariant === 'black' ? 'blue' : 'black'));
        setTitleVariant((prevVariant) => (prevVariant === 'Desativar anúncio' ? 'Ativar Anúncio' : 'Desativar anúncio'));
        setShowAdInactive((prevShowAdInactive) => !prevShowAdInactive)//desativar a frase ativar anuncio da img
        setImageBlur(showAdInactive ? 0 : 2); // Define o desfoque para 10 quando o anúncio está desativado
    }

    return (
        <ScrollView bg='gray.600' flex={1}>
            <Box mt={36} p={23}>
                <TouchableOpacity onPress={handlePress}>
                    <ArrowLeft />
                </TouchableOpacity>
            </Box>
            <Image
                alt="img product"
                source={imgProduct}
                w={'100%'}
                blurRadius={imageBlur}
            />
            {showAdInactive && (
                <Text position={'absolute'} fontWeight={'bold'} fontSize={'sm'} color={'gray.700'} left={120} top={240}>
                    Anúncio desativado
                </Text>
            )}
            <HStack p={23}>
                <UserPhoto size={23} alt="img do profile" />
                <Text ml={3} fontSize={'sm'} color={'gray.100'}>Junior Soares</Text>
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
                    rounded="full">NOVO
                </Text>

                <HStack justifyContent={'space-between'} alignItems={'center'} mr={23} mt={3}>
                    <Text fontSize='xl' fontWeight={'bold'} color={'gray.100'}>Bicicleta</Text>
                    <Text color={'blue.500'} fontSize='xl' fontWeight={'bold'}>R$ 120,00</Text>
                </HStack>
                <Text mt={2}>
                    Cras congue cursus in tortor sagittis placerat nunc, tellus arcu. Vitae ante leo eget maecenas urna mattis cursus. Mauris metus amet nibh mauris mauris accumsan, euismod. Aenean leo nunc, purus iaculis in aliquam.
                </Text>

                <Button onPress={handleActiveouDesactivAds} title={titleVariant} w={327} variant={buttonVariant} mt={2} />
                <Button title="Excluir anúncio" w={327} variant='gray' mt={2} />

            </VStack>
        </ScrollView >
    )
}