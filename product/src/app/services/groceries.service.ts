import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IProduct } from '../shared/models/products.model';

@Injectable({ providedIn: 'root' })
export class GroceriesService {
  constructor(private http: HttpClient) {}

  getGroceries(): Observable<IProduct[]> {
    return this.http
      .get<{ products: any[] }>('https://dummyjson.com/products/category/groceries')
      .pipe(
        map(({ products }) =>
          products.map(p => ({
            id: p.id,
            name: p.title,
            price: p.price,          // DummyJSON has a numeric price
            img: p.thumbnail ?? p.images?.[0] ?? 'https://placehold.co/600x400'
          }))
        )
      );
  }
}
