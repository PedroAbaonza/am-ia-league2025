import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  title: string;
  type: 'aws-training' | 'demo' | 'working-hours';
  date: string;
  time: string;
  description: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/assets/data/events.json');
  }
}
