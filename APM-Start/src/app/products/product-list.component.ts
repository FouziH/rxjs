import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, pipe, map, Observable, of, EMPTY, filter, Subject, combineLatest, retry, startWith, BehaviorSubject } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from "../product-categories/product-category.service";

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  // categories: ProductCategory[] = [];

  /**Relates 1 in th ehtml component */
  // selectedCategoryId = 1;

  /**Relates 2 in the component html */

  // private categorySelectedSubject = new Subject<number>()
      //Vs BehaviorSubject
  private categorySelectedSubject = new BehaviorSubject<number>(0)
  categorySelectedAction$ = this.categorySelectedSubject.asObservable()


  /** Relates part 1 in the component html */
  // products$ = this.productService.productWithCategory$.pipe(
  //   catchError((err) => {
  //     this.errorMessage = err;
  //     //return empty array
  //     //  return of([]);
  //     return EMPTY;
  //   })
  // );

  products$ = combineLatest([
    this.productService.productWithCategory$,
    this.categorySelectedAction$ /*.pipe(
      part of the Subject BehaviorSubject donnot need the startwith
      startWith(0)
    )*/
  ]).pipe(
    map(([products, selectedCategoryId]) => products.filter(product => selectedCategoryId ? product.categoryId === selectedCategoryId : true)),
    catchError(error => {
      this.errorMessage = error;
      return EMPTY
    })
  )

  categories$
 = this.productCategoryService.productCategory$.pipe(
   catchError(error => {
     this.errorMessage = error;
     return EMPTY
   })
 )

 //relates to 1 in the html component
  // productsSimpleFilter$ = this.productService.productWithCategory$.pipe(
  //   // filter(items  => items.categoryId === this.selectedCategoryId) <--- this wont work
  //   map(products => products.filter(product => this.selectedCategoryId? product.categoryId === this.selectedCategoryId: true))
  // )


  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) {}



  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    // console.log('Not yet implemented');

    /** relates 1 from the component */
    // this.selectedCategoryId = +categoryId

    this.categorySelectedSubject.next(+categoryId)



    
  }
}
