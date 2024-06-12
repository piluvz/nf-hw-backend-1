import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';



// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEvents(): Promise<IEvent[]> {
      return await EventModel.find().exec(); 
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }

    // async getEventsByCity(city: string): Promise<IEvent[]> {
    //   const events = await EventModel.find({ location: city }).exec();
    //   return events;
    // }
    
    async getEventsByCity(city: string, startIndex: number, limit: number, sortBy: string, sortDirection: 'asc' | 'desc'): Promise<IEvent[]> {
      const sortCriteria: { [key: string]: 1 | -1 } = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };
      const events = await EventModel.find({ location: city }).sort(sortCriteria).skip(startIndex).limit(limit).exec();
      return events;
    }
  
    async getTotalEventsByCity(city: string): Promise<number> {
        return await EventModel.countDocuments({ location: city }).exec();
    }
  
  }
  
  export default EventService;
  