import { HStack, Image, Text, View } from 'native-base';
import imgBike from '@assets/bike.png'
import { UserPhoto } from './UserPhoto';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

type Props = {
    is_new: boolean
    imgAds?: string
    title: string
    price: string
    disabled?: 'ANÚNCIO DESATIVADO'
}

export function MyCard({ title, price, is_new, imgAds, disabled, ...rest }: Props) {

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handlePress() {
        navigation.navigate('detailsMyAds')
    }

    const isNewText = is_new ? 'NOVO' : 'USADO'

    const isNewBackgroundColor = is_new ? 'blue.500' : 'gray.200';

    return (
        <TouchableOpacity onPress={handlePress}>
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
                <Image alt='item a venda' source={imgBike} />
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
                    {disabled}
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
