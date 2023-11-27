import { HStack, Image, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type PropsDetails = {
    is_active?: boolean
    id?: number
    is_new: boolean
    imgAds?: string | string[]
    title: string
    price: string
    description?: string
    active?: boolean
    onPress?: (info: PropsDetails) => void;
}

export function MyCard({ id, title, price, is_new, imgAds, active, description, onPress, ...rest }: PropsDetails) {

    const isNewText = is_new ? 'NOVO' : 'USADO'
    const isNewBackgroundColor = is_new ? 'blue.500' : 'gray.200';
    const singleImageSource = Array.isArray(imgAds) ? imgAds[0] : imgAds

    return (
        <TouchableOpacity onPress={() => onPress?.({ id, title, price, is_new, imgAds: singleImageSource || '', active, description, ...rest })}>
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
                    source={{ uri: singleImageSource }}
                    h={100} w={153}
                    blurRadius={active ? 0 : 10}
                />
                <HStack position='absolute' alignItems="center" right={0} top={1}>
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
                    {active ? active : 'Anúncio desativado'}
                </Text>
                <Text fontSize='sm' color='gray.200'>
                    {title}
                </Text>
                <Text fontWeight='bold' color='gray.100'>
                    R$ {price}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
