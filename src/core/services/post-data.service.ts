import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { postDataInterface } from '../interface/user';
import { environment } from '../../environment/environment';
import * as CryptoJS from 'crypto-js';  // Import the crypto-js library

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  private apiUrl = environment.apiUrl; 
  private botToken = environment.telegramBotToken;
  private isProduction = environment.production;
  constructor(private http: HttpClient) {}

  private hashDataWithBotToken(data: any): string {
    const dataString = JSON.stringify(data);  // Convert data to JSON string
    return CryptoJS.HmacSHA256(dataString, this.botToken).toString();  // HMAC using bot token
  }
  sendData(controllerName: string, postData: postDataInterface): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    const url = `${this.apiUrl}/${controllerName}`; // Append the controller name to the API URL
    const dataToSend = this.isProduction
    ? { hashedData: this.hashDataWithBotToken(postData) }
    : postData;
    return this.http.post<any>(url, dataToSend, { headers });
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
