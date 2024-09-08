import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boost, postDataInterface } from '../interface/user';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BoostDataFetch {
  private apiUrl = environment.apiUrl; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // POST method
  sendData(controllerName: string, postData: Boost): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    const url = `${this.apiUrl}/${controllerName}`; // Append the controller name to the API URL
  
    return this.http.post<any>(url, postData, { headers });
  }

  
}
