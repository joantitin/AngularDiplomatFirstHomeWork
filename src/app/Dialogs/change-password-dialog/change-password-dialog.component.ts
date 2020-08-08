import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  email: string;
  constructor(
    private authenticationService: AngularFireAuth,
    private dialog: MatDialogRef<ChangePasswordDialogComponent>,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  async sendRecoveryPasswor() {
    try {
      this.spinner.show();
      await this.authenticationService.sendPasswordResetEmail(this.email);
      this.dialog.close();
      this.toastService.success('Se envio un mensaje con las instrucciones a su correo electronico', 'Exito');
      this.spinner.hide();
    }
    catch (error) {
      this.spinner.hide();
      this.toastService.error('Direccion de correo invalida , corrijala e intente denuevo', 'Ha ocurrido un error inesperado');
    }
  }

}
