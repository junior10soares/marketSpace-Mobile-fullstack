import { HStack, Image, Text, View } from 'native-base';
import { UserPhoto } from './UserPhoto';
import { ImageSourcePropType } from 'react-native';

type Props = {
    is_new: boolean
    imgAds: ImageSourcePropType
    title: string
    name: string
    price: string
    avatar: ImageSourcePropType
    disabled?: 'ANÚNCIO DESATIVADO'
}

export function Card({ title, price, is_new, imgAds, avatar, name, disabled, ...rest }: Props) {


    const isNewText = is_new ? 'NOVO' : 'USADO'; // Exibir 'NOVO' se for verdadeiro, senão 'USADO'

    const isNewBackgroundColor = is_new ? 'blue.500' : 'gray.200';

    return (

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
            <Image alt='item a venda' source={imgAds} />

            <HStack position='absolute' alignItems="center" space={84}>
                <UserPhoto size={23} left={1} alt='img perfil' source={avatar} />
                <Text
                    bg={isNewBackgroundColor}
                    h={17}
                    w={43}
                    textAlign='center'
                    color='gray.700'
                    fontWeight='bold'
                    fontSize={10}
                    rounded="full">
                    {isNewText}
                </Text>
            </HStack>
            <Text
                position='absolute'
                top={20}
                left={2}
                color={'gray.700'}
                fontSize={11}
                fontWeight={'bold'}>
                {disabled}
            </Text>
            <Text fontSize='sm' color='gray.200'>
                {title}
            </Text>
            <Text fontWeight='bold' color='gray.100'>
                {price}
            </Text>
        </View>

    );
}
