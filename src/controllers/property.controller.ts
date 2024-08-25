import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property.model';

const propertyService = new PropertyService();

export const addProperty = async (req: Request, res: Response) => {
  const {
    Title, City, Price, Type, Description, Zipcode, Longitude, Latitude, User_Id
  } = req.body;
  const image = req.file;

  try {
    const parsedLongitude = parseFloat(Longitude);
    const parsedLatitude = parseFloat(Latitude);

    const property: Omit<Property, 'id' | 'created_at'> = {
      title: Title,
      city: City,
      price: parseFloat(Price),
      type: Type,
      description: Description,
      image: image ? image.buffer : null,
      zipcode: Zipcode,
      geometry: `POINT(${parsedLongitude} ${parsedLatitude})`,
      user_id: parseInt(User_Id),
    };

    const newProperty = await propertyService.addProperty(property);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
