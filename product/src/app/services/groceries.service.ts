import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  groceryArray:any=[];
  jsonUrl='http://localhost:3000/products'
  constructor(private http:HttpClient) {}
  //method to get the product details from the json
  getGroceries(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
