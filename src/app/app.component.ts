import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FirstHomeWork';
  isLogin: boolean;

  constructor(private router: Router, private authenticationService: AngularFireAuth) { }

  ngOnInit() {
    this.authenticationService.authState.subscribe(user => {
      if (!user) {
        this.isLogin = false;
        this.router.navigate(['/']);
      }
      else {
        this.isLogin = true;
      }
    });
  }
}



