import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from "@react-navigation/native";

import logoImg2x from '@assets/logo2x.png';
import userPhotoDefault from '@assets/userPhotoDefault.png'

import * as ImagePicker from 'expo-image-picker';
import { FileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';

import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { api } from "@services/api";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string
    email: string,
    password: string
    password_confirm: string
    tel: string
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    tel: yup.string().required('Informe o telefone'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere'),//vendo o mesmo input de senhas sao iguais
});

export function SignOut() {
    const [isLoading, setIsLoading] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const toast = useToast()
    const { singIn } = useAuth();
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema),
    });

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true);

        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4], // 4x4 tam da img 
                allowsEditing: true // p poder editar a foto
            });

            if (photoSelected.canceled) {
                return;
            }

            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo;

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 10) { // Tam máx de img a carregar
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
                        placement: 'top',
                        bgColor: 'red.500'
                    });
                }

                const fileExtension = photoSelected.assets[0].uri.split('.').pop(); // Extrair a extensão da foto

                const photoFile = {
                    name: `avatar.${fileExtension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                setSelectedPhoto(photoFile)
            }

        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Ocorreu um erro ao selecionar a foto',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    async function handleSignUp({ email, name, password, tel }: FormDataProps) {
        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('email', email);
            formData.append('tel', tel);
            formData.append('password', password);
            formData.append('avatar', selectedPhoto);

            await api.post('/users/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            await singIn(email, password)

            toast.show({
                title: 'Usuário criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });

        } catch (error: any) {
            console.log(error);

            let errorMessage = 'Ocorreu um erro ao criar o usuário';

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.show({
                title: errorMessage,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }

    function handleGoBack() {
        navigation.goBack()
    }

    return (
        <ScrollView
            bg='gray.600'
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack>
                <Center>
                    <Image
                        mt={65}
                        alt="Logo"
                        source={logoImg2x}
                        defaultSource={logoImg2x}
                        resizeMode="contain"
                    />
                    <Heading mt={6} fontSize='xl'>
                        Boas vindas!
                    </Heading>
                    <Text fontSize='sm' color='gray.200' mt={3}>
                        Crie sua conta e use o espaço para comprar {'\n'}
                        {'   '}itens variados e vender seus produtos
                    </Text>
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        {selectedPhoto ? (
                            <UserPhoto size={88} mt={33} alt="foto do usuario" source={selectedPhoto} />
                        ) : (
                            <UserPhoto size={88} mt={33} alt="foto do usuario" source={userPhotoDefault} />
                        )}
                    </TouchableOpacity>
                    <Center mt={17}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    showEyeIcon={false}
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    showEyeIcon={false}
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="tel"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    showEyeIcon={false}
                                    placeholder="Telefone"
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.tel?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    showEyeIcon={true}
                                    placeholder="Senha"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="password_confirm"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    showEyeIcon={true}
                                    placeholder="Confirmar senha"
                                    onChangeText={onChange}
                                    value={value}
                                    onSubmitEditing={handleSubmit(handleSignUp)}//enviar pelo teclado
                                    returnKeyType="send"//teclado muda
                                    errorMessage={errors.password_confirm?.message}
                                />
                            )}
                        />
                    </Center>
                    <Button
                        title="Criar"
                        variant="black"
                        onPress={handleSubmit(handleSignUp)}
                        isLoading={isLoading}
                    />
                    <Text fontSize='sm' color='gray.400' mt={3}>
                        Já tem uma conta?
                    </Text>
                    <Button
                        onPress={handleGoBack}
                        mt={2}
                        mb={4}
                        title="Ir para o login"
                        variant="gray"
                    />
                </Center>
            </VStack>
        </ScrollView >

    )
}