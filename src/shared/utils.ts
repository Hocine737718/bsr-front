import { baseURL } from "@/services/api"

export const getRandom = (max: number) => {
    return (Math.random() * max).toFixed(0)
}
export const getFullPath = (path: string) => {
    let x = baseURL + path;
    return x;
}
export enum Size {
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}
export const sizeEnumList = ['S', 'M', 'L', 'XL', 'XXL']; 