import { baseURL } from "@/services/api"

export const getRandom = (max: number) => {
    return (Math.random() * max).toFixed(0)
}
export const getFullPath = (path: string) => {
    let x = baseURL + path;
    return x;
}