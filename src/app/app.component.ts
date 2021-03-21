import { Component } from '@angular/core';
import { ZomotoService } from './services/zomoto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zomato';
  constructor(private _data: ZomotoService) {
  }

  city: string = ""
  establistment_id: number = 0
  cuisine_id: number = 0

  unamePattern: string = "^[a-zA-Z ]+";

  //could create specfic model
  res_category: any = []
  cuisines_cat: any = []
  restaurants: any = []
  gecode: any = {}

  city_id: number
  resetRestaurants() {
    this.restaurants = []
  }
  resetCuisines() {
    this.cuisines_cat = []
    this.cuisine_id = 0
  }

  resetResCategory() {
    this.res_category = []
    this.establistment_id = 0
  }
  restaurantCategory() {
    this.resetCuisines()
    this.resetResCategory()
    this.resetRestaurants()
    this.is_loading = true
    this.check_city(this.city).then(city => {
      this.city_id = city['id']
      if (city['id'] != undefined) {
        this.gecodes(city)

      }
    }).catch(e => {
      console.log(e);
      this.resetCity()
    });
  }

  private resetCity() {
    this.city = ""
  }

  gecodes(city) {
    this._data.geocodes(this.city).subscribe((res) => {
      try {
        if (res['resourceSets'][0]['resources'].length != 0) {
          let lat = res['resourceSets'][0]['resources'][0]['bbox'][0]
          let lon = res['resourceSets'][0]['resources'][0]['bbox'][1]
          this.gecode['lon'] = lon
          this.gecode['lat'] = lat;
          this.category(city, this.gecode.lat, this.gecode.lon)
          this.cusines(city, this.gecode.lat, this.gecode.lon)
          this.is_loading = false
        } else {
          this.resetCity()
          throw new Error('gecodes not found for the given city')
        }
      } catch (error) {
        console.log(error)
      }
    });
  }


  category(city, lat, lon) {
    this._data.restaurantCategory(city['id'], lat, lon).subscribe((res) => {
      this.res_category = res['establishments']
    })
  }

  cusines(city, lat, lon) {
    this._data.cuisines(city['id'], lat, lon).subscribe((res) => {
      this.cuisines_cat = res['cuisines']
    })
  }
  is_loading: boolean = false
  restaurant() {
    this.is_loading = true
    this._data.restaurants(this.city_id, this.gecode, this.establistment_id, this.cuisine_id).subscribe((res) => {
      this.restaurants = res['restaurants']
      this.is_loading = false
    })
  }

  check_city(city) {
    return new Promise((resolve, reject) => {
      this._data.cities(city).subscribe((result) => {
        let cities_list = result['location_suggestions'];
        if (cities_list.length > 0) {
          resolve(cities_list[0])
        } else {
          reject(Error("No city found with given name " + city))
        }
      }, error => {
        this.resetCity()
      });

    })
  }

}
