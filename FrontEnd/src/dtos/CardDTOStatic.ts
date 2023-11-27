import { ImageSourcePropType } from "react-native";

type Products = {
    path: string
    product_id: string
}

export type CardDTOStatic = {
    id: number
    name: string
    nameFirst: string
    avatar: ImageSourcePropType;
    is_new: boolean
    price: string
    imgAds: ImageSourcePropType
    product_images?: Products[]
}