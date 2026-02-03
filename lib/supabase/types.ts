export interface Car {
    id: string
    title: string
    price: number
    year: number
    km: number
    transmission: string
    fuel: string
    description: string | null
    images: string[]
    created_at: string
    updated_at: string
}
export interface CarInsert {
    title: string
    price: number
    year: number
    km: number
    transmission: string
    fuel: string
    description?: string
    images: string[]
}