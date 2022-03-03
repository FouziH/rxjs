import { ChangeDetectionStrategy, Component } from '@angular/core';

import { catchError, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  // selectedProductId = 0;


  selectedProduct$ = this.productService.selectedProduct$

  products$ = this.productService.productWithCategory$.pipe(
    catchError(err =>{
      this.errorMessage = err;
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
