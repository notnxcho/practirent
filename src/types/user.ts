import { Property } from "./property"

export type User = {
    id: string,
    email: string,
    name: string,
    properties: Property[]
}