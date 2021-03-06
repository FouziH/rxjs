import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, catchError, combineLatest, map, merge, Observable, scan, share, shareReplay, Subject, tap, throwError } from 'rxjs';

import { Product } from './product';
import { ProductCategoryService } from "../product-categories/product-category.service";
import { SupplierService } from "../suppliers/supplier.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  products$ =this.http.get<Product[]>(this.productsUrl)
  .pipe(
    //map(item => item.price * 1),
    tap(get => console.log(`HTTP get request data is: ${get}`)), 
    // map(products => 
    //   products.map(product => ({
    //     ...product, 
    //     price: product.price? product.price * 1.5 : 0,
    //     searchKey: [product.productName]
    //   } as Product))),
    tap(product => console.log(`Products are: ${product}`)),


    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategory$
  ]).pipe(
    map(([products, categories]) => products.map(
      product => ({
      ...product,
      price: product.price? product.price * 1.5 : 0,
      category: categories.find(c => product.categoryId === c.id)?.name,
      searchKey: [product.productName]
    } as Product))
    
    ),
     shareReplay(1)
  )
  private productSelectedSubject  = new BehaviorSubject<number>(0);
  productSelectedAction$  = this.productSelectedSubject.asObservable()

  // selectedProduct$ = this.productWithCategory$.pipe(
  //   map(products  => products.find(product => product.id === 5)),
  //   //adding tap as debugger method
  //   tap(product => console.log("SelectedProduct id is", product))
  // )
  selectedProduct$  = combineLatest([
    this.productWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) => 
    products.find(product => product.id === selectedProductId), 
    tap(product=> console.log(`SelectedProduct ${product}`)), 
    
    ),
    shareReplay(1)
  )

  private productInsertedSubject = new Subject<Product>();
  productInsertedAction$ = this.productInsertedSubject.asObservable()

  productsWithAdd$ = merge(
    this.productWithCategory$,
    this.productInsertedAction$
  ).pipe(
    scan((acc, value)=> 
    (value instanceof Array) ? [...value]: [...acc, value], [] as Product [])
  )
  
  
  constructor(private http: HttpClient, private productCategoryService: ProductCategoryService , private supplierService: SupplierService) { }

    selectedProductChanged(selectProductId: number) {
      this.productSelectedSubject.next(selectProductId)
    }

    addProduct (newProduct?: Product) {
      newProduct = newProduct || this.fakeProduct();
      this.productInsertedSubject.next(newProduct)
    }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
