import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {

  constructor(private authenticationService: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async logout() {
    await this.authenticationService.signOut();
  }

}
