import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, map, concatMap, tap, mergeMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from "./supplier";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';
  supplierWithMap$ = of(1, 2, 5)
  .pipe(
    map(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  )

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
    tap(data => console.log('supplier data', JSON.stringify(data))),
    shareReplay(1), catchError(this.handleError)
  )

  // supplierWithConcatMap$ = of(1, 5, 8).pipe(
  //   tap(id => console.log(`concatMap source Observable ${id}`)),
  //   concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  // )

  // supplierWithMergeMap$ = of(1, 5, 8).pipe(
  //   tap(id => console.log('SupplierWithMergeMap initial', id)),
  //   mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
  //   tap(id => console.log('SupplierWithMergeMap results', id)),
  // )
  supplierWithswitchMap$ = of(1, 5, 8).pipe(
    tap(id => console.log('SupplierWithswitchMap initial', id)),
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
    tap(id => console.log('SupplierWithswitchMap results', id)),
  )

  constructor(private http: HttpClient) {
    /** Bad code with higher order absorvables */
    // this.supplierWithMap$.subscribe(o => o.subscribe(item => console.log('map result in the constructore is', item)))

    /**Good method when dealing with higher order observables using concatMap */
    // this.supplierWithConcatMap$.subscribe(item => console.log('ConcatMap Observable Results', item))

    /** Good method when dealing with higher order observables using switchMap */
    // this.supplierWithswitchMap$.subscribe(item => console.log('switchMap Observable Results', item))
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
