import { query } from '../db';
import { Property } from '../models/property.model';

export class PropertyService {
  async addProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
    const { title, city, price, type, description, image, zipcode, geometry, user_id } = property;
    const result = await query(
      `INSERT INTO "PropertyDetails" (
        "Title", "City", "Price", "Type", "Description", 
        "Image", "Zipcode", "Geometry", "User_Id"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [title, city, price, type, description, image, zipcode, geometry, user_id]
    );
    return result.rows[0];
  }

  async getAllProperties(): Promise<Property[]> {
    const result = await query('SELECT * FROM "PropertyDetails"');
    return result.rows;
  }
}
