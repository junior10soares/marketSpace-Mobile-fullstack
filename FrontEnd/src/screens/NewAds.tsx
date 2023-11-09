import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { Box, Checkbox, HStack, Heading, ScrollView, Text, VStack, useToast } from "native-base";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { FileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { UserPhoto } from "@components/UserPhoto";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "@services/api";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type FormDataProps = {
    name: string;
    price: string;
    description: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    price: yup.string().required('Informe o preço'),
    description: yup.string().required('Informe a descrição'),
});

export function NewAds() {

    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const toast = useToast()

    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [condition, setCondition] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<FormDataProps[]>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema),
    });

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true);

        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if (photoSelected.canceled) {
                return;
            }

            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo;

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 10) {
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }

                const fileExtension = photoSelected.assets[0].uri.split('.').pop();

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

    async function handleDescriptionProduct({ name, description, price }: FormDataProps) {
        setIsLoading(true);

        try {
            const productData = {
                name,
                description,
                is_new: condition === 'NOVO' ? true : false,
                price: parseInt(price),
                accept_trade: true,
                payment_methods: ["pix"]
            };
            const response = await api.post('/products/', productData)

            const photoData = new FormData();
            photoData.append('product_id', response.data.id);
            photoData.append('images', selectedPhoto);

            await api.post('/products/images/', photoData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigation.navigate('myads');

            toast.show({
                title: 'Produto criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });
        } catch (error: any) {
            console.log(error);
            let errorMessage = 'Ocorreu um erro ao criar o produto';

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
        <ScrollView bg={'gray.600'} p={23} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <HStack mt={36} alignItems={'center'} space={20}>
                <TouchableOpacity onPress={handleGoBack}>
                    <ArrowLeft />
                </TouchableOpacity>
                <Heading>Criar anúncio</Heading>
            </HStack>

            <VStack mt={5}>
                <Text fontWeight={'bold'} mt={2} color={'gray.200'}>Imagens</Text>
                <Text color={'gray.300'} mt={2}>Escolha até 1 imagens para mostrar o quando o seu produto é incrível!</Text>
            </VStack>

            {selectedPhoto ? (
                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <UserPhoto mt={15} size={100} rounded="none" source={{ uri: selectedPhoto.uri }} alt="Imagem do produto" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <Box mt={15} h={100} w={100} bg={'gray.500'} alignItems={'center'} justifyContent={'center'}>
                        <Plus />
                    </Box>
                </TouchableOpacity>
            )}
            <Text mt={31} fontSize={'md'} fontWeight={'bold'}>Sobre o produto</Text>

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <Input
                        w={327}
                        mt={15}
                        showEyeIcon={false}
                        placeholder="Título do anúncio"
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.name?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <Input
                        w={327}
                        showEyeIcon={false}
                        placeholder="Descrição do produto"
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.description?.message}
                    />
                )}
            />
            <HStack alignItems={'center'} space={1}>
                <Checkbox
                    value="NOVO"
                    isChecked={condition === 'NOVO'}
                    onChange={() => setCondition('NOVO')}
                >
                    <Text>Produto novo</Text>
                </Checkbox>

                <Checkbox
                    value="USADO"
                    isChecked={condition === 'USADO'}
                    onChange={() => setCondition('USADO')}
                >
                    <Text>Produto usado</Text>
                </Checkbox>

            </HStack>
            <VStack flex={1} mt={33}>

                <Text>Venda</Text>

                <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            mt={2}
                            w={327}
                            showEyeIcon={false}
                            placeholder="R$ Valor do produto"
                            keyboardType="numeric"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.price?.message}
                        />
                    )}
                />
            </VStack>
            <HStack>
                <Button onPress={handleGoBack} w={157} title="Cancelar" variant={'gray'} mr={4} />
                <Button
                    w={157}
                    title="Publicar"
                    variant={'blue'}
                    onPress={handleSubmit(handleDescriptionProduct)}
                    isLoading={isLoading}
                />
            </HStack>
        </ScrollView>
    )
}
