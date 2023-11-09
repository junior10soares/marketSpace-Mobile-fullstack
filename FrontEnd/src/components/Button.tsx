import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
    title: string;
    variant?: string
    size?: number
}

export function Button({ title, variant = 'blue', size = 280, ...rest }: Props) {

    let bgColor = 'transparent';
    let textColor = 'white';
    let pressedBgColor = 'transparent'

    if (variant === 'blue') {
        bgColor = 'blue.500';
        textColor = 'gray.700'
        pressedBgColor = 'blue.400'
    } else if (variant === 'gray') {
        bgColor = 'gray.500';
        textColor = 'gray.200'
        pressedBgColor = 'gray.600'
    } else if (variant === 'black') {
        bgColor = 'black';
        textColor = 'gray.700'
        pressedBgColor = 'gray.200'
    }

    return (
        <ButtonNativeBase
            w={size}
            h={42}
            bg={bgColor}
            rounded="sm"//border radius
            _pressed={{
                bg: pressedBgColor
            }}
            {...rest}
        >
            <Text
                fontWeight='bold'
                color={textColor}
                fontSize="sm"
            >
                {title}
            </Text>
        </ButtonNativeBase >
    );
}