import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable()


  selectedProduct$ = this.productService.selectedProduct$

  products$ = this.productService.productWithCategory$.pipe(
    catchError(err =>{
      this.errorMessageSubject.next(err);
      //return empty array
     //  return of([]);
      return EMPTY
     } )
  );


  constructor(private productService: ProductService) { }

 

 

  onSelected(productId: number): void {
    console.log('Not yet implemented', 'but productId is', productId);

    this.productService.selectedProductChanged(productId)

  }
}
