import { Box, HStack, Image, ScrollView, Text, VStack } from "native-base";

import { ArrowLeft } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { CardDTO } from "@dtos/CardDTO";

type RouteParamsProps = {
    product: CardDTO;
}

export function Details() {

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const route = useRoute();

    const handlePress = () => {
        navigation.goBack()
    }

    const { product } = route.params as RouteParamsProps
    if (!product || !product.name || !product.price || !product.is_new || !product.avatar || !product.imgAds) {
        return null;
    }

    return (
        <ScrollView bg='gray.600' flex={1}>
            <Box mt={36} p={23}>
                <TouchableOpacity onPress={handlePress}>
                    <ArrowLeft />
                </TouchableOpacity>
            </Box>
            <Image
                alt="img-product"
                source={product.imgAds}
                w={'100%'}
            />
            <HStack p={23}>
                <UserPhoto size={23} alt="img do profile" source={product.avatar} />
                <Text ml={3} fontSize={'sm'} color={'gray.100'}>{product.name}</Text>
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
                    {product.is_new}
                </Text>

                <HStack justifyContent={'space-between'} alignItems={'center'} mr={23} mt={3}>
                    <Text fontSize='xl' fontWeight={'bold'} color={'gray.100'}>{product.name}</Text>
                    <Text color={'blue.500'} fontSize='xl' fontWeight={'bold'}>{product.price}</Text>
                </HStack>
                <Text mt={2}>
                    Cras congue cursus in tortor sagittis placerat nunc, tellus arcu. Vitae ante leo eget maecenas urna mattis cursus. Mauris metus amet nibh mauris mauris accumsan, euismod. Aenean leo nunc, purus iaculis in aliquam.
                </Text>

                <HStack alignItems={'center'} mr={23} justifyContent='space-between' mt={19}>
                    <Text fontWeight={'bold'} color={'blue.500'} fontSize={'xxl'}>{product.price}</Text>

                    <Button w={169} title="Entrar em contato" />
                </HStack>
            </VStack>
        </ScrollView>
    )
}