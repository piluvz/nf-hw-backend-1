import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

import { Pagination } from '../auth/types/response';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    // getEvents = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const userCity  = (req as any).user.city;
    //         if (!userCity) {
    //             res.status(400).json({ message: 'User city not found in token' , userCity: (req as any).user});
    //             return;
    //         }
    //         const events = await this.eventService.getEventsByCity(userCity);
    //         res.status(200).json(events);
    //     } catch (error: any) {
    //         res.status(500).send({ error: error.message });
    //     }
    // }

    getEvents = async (req: Request, res: Response): Promise<void> => {
      try {
          const userCity = (req as any).user.city;
          if (!userCity) {
              res.status(400).json({ message: 'User city not found in token' });
              return;
          }
  
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;

          const sortBy = req.query.sortBy as string || 'name';
          const sortDirection = req.query.sortDirection as 'asc' | 'desc' || 'asc';
          const sort = {};
          sort[sortBy] = sortDirection === 'desc' ? -1 : 1;

          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          const totalEvents = await this.eventService.getTotalEventsByCity(userCity);
  
          const events = await this.eventService.getEventsByCity(userCity, startIndex, limit, sortBy, sortDirection);
  
          const pagination: Pagination = {};
  
          if (endIndex < totalEvents) {
              pagination.next = {
                  page: page + 1,
                  limit: limit
              };
          }
  
          if (startIndex > 0) {
              pagination.prev = {
                  page: page - 1,
                  limit: limit
              };
          }
  
          res.status(200).json({ events, pagination });
      } catch (error: any) {
          res.status(500).send({ error: error.message });
      }
    }
  

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;