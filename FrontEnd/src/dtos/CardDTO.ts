import { ImageSourcePropType } from "react-native"

type Products = {
    path: string
    product_id: string
}

export type CardDTO = {
    id: number
    title: string
    name: string
    avatar: string | ImageSourcePropType
    is_new: boolean
    price: string
    imgAds: string
    description?: string
    product_images?: Products[]
    is_active: boolean
}