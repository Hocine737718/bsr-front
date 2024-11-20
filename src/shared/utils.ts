import { baseURL } from "@/services/api"

export const getRandom = (max: number) => {
    return (Math.random() * max).toFixed(0)
}
export const getFullPath = (path: string) => {
    let x = baseURL + path;
    return x;
}
export enum Size {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}
export enum Color {
    Black = "Black",
    White = "White"
}
export const sizeEnumList = ['S', 'M', 'L', 'XL', 'XXL'];
export const colorList = [{ display: 'Noir', value: 'Black' }, { display: 'Blanc', value: 'White' }]; 