import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:3000/api/cars'; 

  constructor(private http: HttpClient) {}

  // Get all cars
  getCars(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get car by ID
  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Add a new car
  addCar(car: any): Observable<any> {
    return this.http.post(this.apiUrl, car);
  }

  // Update a car
  updateCar(id: number, car: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, car);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/cars/uploads', formData);
  }

  // Delete a car
  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
