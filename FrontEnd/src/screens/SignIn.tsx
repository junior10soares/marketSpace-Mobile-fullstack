import { Box, Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

import logoImg from '@assets/logo.png';
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

type FormData = {
    email: string;
    password: string;
}

export function SignIn() {

    const [isLoading, setIsLoading] = useState(false)

    const { singIn } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

    const toast = useToast();

    const navigation = useNavigation<AuthNavigatorRoutesProps>()

    function handleNewAccount() {
        navigation.navigate('signOut')
    }

    async function handleSignIn({ email, password }: FormData) {

        try {
            await singIn(email, password);
            setIsLoading(true)

        } catch (error) {

            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
            setIsLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack borderBottomRadius={20} bg='gray.600' >
                <Center>
                    <Image
                        mt={65}
                        alt="Logo"
                        source={logoImg}
                        defaultSource={logoImg}
                        resizeMode="contain"
                    />
                    <Heading pt={30} color="gray.100" fontWeight='bold'>
                        marketspace
                    </Heading>
                    <Text fontSize='sm' color="gray.300">
                        Seu espaço de compra e venda
                    </Text>
                    <Text mt={76} fontSize='sm' color="gray.200">
                        Acesse sua conta
                    </Text>
                    <Box pb={68} mt={4}>
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: 'Informe o e-mail' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    showEyeIcon={false}
                                    onChangeText={onChange}
                                />
                            )}

                        />
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: 'Informe a senha' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Senha"
                                    showEyeIcon={true}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        <Button
                            mt={5}
                            title="Entrar"
                            variant='blue'
                            isLoading={isLoading}
                            onPress={handleSubmit(handleSignIn)}
                        />
                    </Box>
                </Center>
            </VStack>

            <Center mt={16} bg='white'>
                <Text pb={6}>
                    Ainda não tem acesso?
                </Text>
                <Button
                    onPress={handleNewAccount}
                    title="Criar uma conta"
                    variant='gray'
                />
            </Center>
        </ScrollView>

    )
}