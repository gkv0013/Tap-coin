import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { postDataInterface } from '../interface/user';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  private apiUrl = environment.apiUrl; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // POST method
  sendData(controllerName: string, postData: postDataInterface): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    const url = `${this.apiUrl}/${controllerName}`; // Append the controller name to the API URL
  
    return this.http.post<any>(url, postData, { headers });
  }

  // PUT method
  updateData(id: string, putData: postDataInterface): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, putData, { headers });
  }

  // DELETE method
  deleteData(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, { headers });
  }

  // GET method
  getData(params?: HttpParams): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  // PATCH method
  patchData(id: string, patchData: postDataInterface): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<any>(url, patchData, { headers });
  }
}
