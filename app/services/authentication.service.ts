import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router'

@Injectable()

export class AuthenticationService {
  public token: string;

  constructor(private http: Http, private router: Router){
    
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username, password): Observable<boolean>{
    let queryString = "grant_type=password&username={{username}}&password={{password}}";

    return this.http.post('https://concepta-node-js.herokuapp.com/v1/auth', queryString)
      .map((response: Response) => {
        let token = response.json() && response.json().data.access_token;
        if(token){
          this.token = token;

          localStorage.setItem('currentUser', JSON.stringfy({ username: username, token: token  } ));

          return true;
        
        }else{
          return false;
        }

      });
  
  }

  logout(): void{
    this.token = null;
    localStorage.remove('currentUser');
  }


  checkCredentials(){
    if(localStorage.getItem('currentUser' === null || this.token === null)){
      this.router.navigate(['/login']);
    }
  }

}
