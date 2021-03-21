import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ZomotoService {

  constructor(private _http: HttpClient) { }

  APIKEY = "ebce07efec80d0017e1a3ee7173cdbd6"
  Base_URL = "https://developers.zomato.com/api/v2.1"
  BINGKEY = "AmxoHEdBTCl_Y1NzmWxnSnnyqYkE9UGf_8NCRG5YxAhFFzEt7t019lO3S_81eHus"

  headerDict = {
    'Content-Type': 'application/json',
    'user-key': this.APIKEY
  }
  requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };


  cities(city: string) {
    const url = `${this.Base_URL}/cities?q=/ ${city}`
    return this._http.get(url, this.requestOptions).pipe(catchError(this.handleError))
  }

  geocodes(city) {
    let loc = ''
    const url = `http://dev.virtualearth.net/REST/v1/Locations?q=${loc},${city}&key=${this.BINGKEY}`
    return this._http.get(url).pipe(catchError(this.handleError))
  }

  restaurantCategory(city_id, lat, lon) {
    const url = `${this.Base_URL}/establishments?city_id=${city_id}&lat=${lat}&lon=${lon}}`
    return this._http.get(url, this.requestOptions).pipe(catchError(this.handleError))
  }

  cuisines(city_id, lat, lon) {
    const url = `${this.Base_URL}/cuisines?city_id=${city_id}&lat=${lat}&lon=${lon}}`
    return this._http.get(url, this.requestOptions).pipe(catchError(this.handleError))
  }

  restaurants(city_id, gecode, establishment_type_id, cuisine_id) {
    const url = `${this.Base_URL}/search?city_id=${city_id}&lat=${gecode.lat}&lon=${gecode.lon}&establishment_id=${establishment_type_id}&&cuisines=${cuisine_id}&radius=500&sort=real_distance&order=asc&start=0&count=10`
    return this._http.get(url, this.requestOptions).pipe(catchError(this.handleError))
  }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
