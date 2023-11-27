import { Box, HStack, Image, ScrollView, Text, VStack } from "native-base";
import { ArrowLeft } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react"
import { useNavigation, useRoute } from "@react-navigation/native";

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { PropsCard } from "@components/Card";
import { api } from "@services/api";
import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";

export function Details() {

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const route = useRoute();
    const details = (route.params as { details: PropsCard & { key?: string, imgAds: string, avatar: string } } | undefined)?.details;
    const [imageUri, setImageUri] = useState<string | undefined>(details?.imgAds)
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()
    const singleImageSource = Array.isArray(details?.imgAds) ? details?.imgAds[0] : details?.imgAds;

    function handlePress() {
        navigation.goBack();
    }

    useEffect(() => {
        setLoading(true)
        setImageUri(details?.imgAds)
    }, [details?.imgAds])

    useEffect(() => {
        if (imageUri) {
            setLoading(false);
        }
    }, [imageUri]);

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
                    alt="img-product"
                    source={
                        typeof imageUri === 'string'
                            ? { uri: imageUri }
                            : imageUri
                                ? imageUri
                                : { uri: `${api.defaults.baseURL}/images/${singleImageSource}` }
                    }
                    w={'100%'}
                    height={280}
                />
            )}
            <HStack p={23}>
                {loading ? (
                    <Loading />
                ) : (
                    <UserPhoto
                        size={23}
                        alt="img do profile"
                        source={typeof details?.avatar === 'string' ? { uri: details?.avatar } : details?.avatar}
                    />
                )}
                <Text ml={3} fontSize={'sm'} color={'gray.100'}>
                    {details?.nameFirts ?? user.name}
                </Text>
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
                    {details?.is_new ? 'NOVO' : 'USUADO'}
                </Text>

                <HStack justifyContent={'space-between'} alignItems={'center'} mr={23} mt={3}>
                    <Text fontSize='xl' fontWeight={'bold'} color={'gray.100'}>
                        {details?.title}
                    </Text>
                    <Text color={'blue.500'} fontSize='xl' fontWeight={'bold'}>
                        R$ {details?.price}
                    </Text>
                </HStack>
                <Text mt={2}>
                    Cras congue cursus in tortor sagittis placerat nunc, tellus arcu. Vitae ante leo eget maecenas urna mattis cursus.
                    Mauris metus amet nibh mauris mauris accumsan, euismod. Aenean leo nunc, purus iaculis in aliquam.
                </Text>

                <HStack alignItems={'center'} mr={23} justifyContent='space-between' mt={19}>
                    <Text fontWeight={'bold'} color={'blue.500'} fontSize={'xxl'}>
                        R$ {details?.price}
                    </Text>
                    <Button w={169} title="Entrar em contato" />
                </HStack>
            </VStack>
        </ScrollView>
    );
}
