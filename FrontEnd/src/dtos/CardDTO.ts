import { ImageSourcePropType } from "react-native";

export type CardDTO = {
    id?: number
    avatar: ImageSourcePropType;
    name: string
    is_new: boolean
    path?: ImageSourcePropType;
    price: string
    title: string
    imgAds: ImageSourcePropType
}