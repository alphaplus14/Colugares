import { ObjectId } from "mongodb";

export interface Event {
  _id: ObjectId;
  name: string;
  region: string;
  city: string;
  start_date: Date;
  end_date: Date;
  description: string;
  tags: string[];
  active: boolean;
}

export type EventDocument = Event;

export type CreateEventInput = Omit<Event, "_id">;
