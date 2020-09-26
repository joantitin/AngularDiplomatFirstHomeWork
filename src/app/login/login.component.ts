import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../Dialogs/change-password-dialog/change-password-dialog.component';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AngularFireAuth,
    private router: Router,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.authenticationService.authState.toPromise().then(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    }).catch(() => {
      this.toastService.error('No se pudo conectar con firebase', 'Ha ocurrido un error inespoerado');
    });
  }

  getEmailError(): string {
    const { required, email } = this.formGroup.get('email').errors;

    if (required) {
      return 'El correo electrónico es requerido';
    }

    if (email) {
      return 'Ingrese un correo electrónico valido';
    }
  }

  getPasswordError(): string {
    const { required } = this.formGroup.get('password').errors;

    if (required) {
      return 'La contraseña es requerida';
    }

  }

  async logIn() {
    try {
      const email = this.formGroup.get('email').value;
      const password = this.formGroup.get('password').value;

      const isUserExist = await this.userService.validateUserExistence(email);

      if (isUserExist) {
        await this.authenticationService.signInWithEmailAndPassword(email, password);
      }
      else {
        this.toastService.error('Este usuario no esta registrado en el sistema', 'Ha ocurrido un error inesperado');
      }
    }

    catch (error) {
      const { message } = error;

      if (message) {
        this.toastService.error('Correo electronico o Password incorrecto', 'Ha ocurrido un error inesperado');
        console.log('Correo electronico o Password incorrecto');
      }
      else {
        console.log('Ha ocurrido un error inesperado');
      }
    }
  }

  openRecoveryPasswordDialog() {
    this.dialog.open(ChangePasswordDialogComponent, {
      disableClose: true
    });
  }
}
