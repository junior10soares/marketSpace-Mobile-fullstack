import { Input as NativeBaseInput, IInputProps, FormControl, Icon } from 'native-base';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = IInputProps & {
    errorMessage?: string | '';
    showEyeIcon: boolean;
};

export function Input({ errorMessage = '', showEyeIcon, ...rest }: Props) {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };

    return (
        <FormControl mb={4}>
            <NativeBaseInput
                bg="gray.700"
                h={45}
                w={280}
                px={4}
                flex={1}
                borderWidth={0}
                fontSize="md"
                color="gray.400"
                placeholderTextColor="gray.400"
                _focus={{
                    bgColor: 'gray.700',
                    borderWidth: 1,
                    borderColor: 'gray.500'
                }}
                {...rest}
                secureTextEntry={!isPasswordVisible && showEyeIcon} // Aplica o secureTextEntry apenas se a senha não estiver visível e showEyeIcon for true
                rightElement={
                    showEyeIcon ? (
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Icon as={isPasswordVisible ? EyeSlash : Eye} />
                        </TouchableOpacity>
                    ) : undefined
                }
            />
            <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}
