import { ImageSourcePropType } from "react-native";

export type NewAdsProps = {
    newOrUsed: "NOVO" | "USADO"
    imgAds?: ImageSourcePropType;
    title: string;
    price: string
    description: string
}