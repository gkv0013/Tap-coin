import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { UserData } from '../interface/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createUser(user: UserData): Observable<UserData> {
    return this.http.post<UserData>(`${this.apiUrl}/user`, user);
  }
  userExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/user/exists/${id}`);
  }
  getUser(id: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/user/${id}`);
  }

  updateUser(id: string, user: UserData): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUrl}/user/${id}`, user);
  }
}
