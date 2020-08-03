import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css']
})
export class LogoutDialogComponent implements OnInit {

  constructor(
    private authenticationService: AngularFireAuth,
    private dialog: MatDialogRef<LogoutDialogComponent>) { }

  ngOnInit(): void {
  }

  async logout() {
    await this.authenticationService.signOut();
    this.dialog.close();
  }

}
