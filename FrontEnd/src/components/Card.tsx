import { HStack, Image, Skeleton, Text, View } from 'native-base';
import { UserPhoto } from './UserPhoto';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';

export type PropsCard = {
    is_new: boolean;
    imgAds?: ImageSourcePropType | string;
    title: string;
    price: string;
    avatar?: ImageSourcePropType | string;
    disabled?: 'ANÚNCIO DESATIVADO'
    nameFirts?: string
    onPress?: (info: PropsCard) => void;
};

export function Card({
    title,
    nameFirts,
    price,
    is_new,
    imgAds = '',
    avatar = '',
    disabled,
    onPress,
    ...rest
}: PropsCard) {
    const isNewText = is_new ? 'NOVO' : 'USADO';
    const isNewBackgroundColor = is_new ? 'blue.500' : 'gray.200';

    const singleImageSource = Array.isArray(imgAds) ? imgAds[0] : imgAds;

    const { user } = useAuth();
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (imgAds || user.avatar) {
            setImageLoading(false);
        }
    }, [imgAds, user.avatar]);

    return (
        <TouchableOpacity onPress={() => onPress?.({ nameFirts, title, price, is_new, imgAds: singleImageSource || '', ...rest })}>
            <View
                mr={3}
                mb={3}
                h={143}
                w={153}
                bg='gray.600'
                rounded={6}
                style={{ marginLeft: 2 }}
                {...rest}
            >
                <Image
                    alt='item a venda'
                    source={
                        typeof imgAds === 'string'
                            ? { uri: imgAds }
                            : imgAds
                                ? imgAds
                                : { uri: `${api.defaults.baseURL}/images/${singleImageSource}` }
                    }
                    h={100}
                    w={153}
                />
                <HStack position='absolute' alignItems='center' space={84}>
                    {imageLoading ? (
                        <Skeleton height={23} width={23} />
                    ) : (
                        <>
                            <UserPhoto
                                size={23}
                                left={1}
                                alt='img perfil'
                                source={
                                    typeof avatar === 'string'
                                        ? { uri: avatar }
                                        : avatar
                                            ? avatar
                                            : { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                                }
                                onLoad={() => setImageLoading(false)}
                            />
                            <Text
                                bg={isNewBackgroundColor}
                                h={17}
                                w={43}
                                textAlign='center'
                                color='gray.700'
                                fontWeight='bold'
                                fontSize={10}
                                rounded='full'
                            >
                                {isNewText}
                            </Text>
                        </>
                    )}
                </HStack>
                <Text
                    position='absolute'
                    top={20}
                    left={2}
                    color={'gray.700'}
                    fontSize={11}
                    fontWeight={'bold'}
                >
                    {disabled}
                </Text>
                <Text fontSize='sm' color='gray.200'>
                    {title}
                </Text>
                <Text fontWeight='bold' color='gray.100'>
                    {price}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
