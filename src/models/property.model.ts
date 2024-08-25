export interface Property {
    id: number;
    title: string;
    city: string;
    price: number;
    type: string;
    description: string;
    image: Buffer | null; // Image stored as binary data
    zipcode: string;
    geometry: string; // Geometry stored as 'POINT(x y)' format in the database
    user_id: number;
    created_at: Date;
}
