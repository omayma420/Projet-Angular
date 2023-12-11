// reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:8087'; // Remplacez par l'URL de votre backend Spring Boot

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/reservation`);
  }

  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/reservation/${id}`);
  }

  postData(reservation: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(reservation);
    return this.http.post<any>(`${this.baseUrl}/api/reservation`, reservation, { headers });
  }
}
