import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AngularFireAuth) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
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
    const { required, minlength, pattern } = this.formGroup.get('password').errors;

    if (required) {
      return 'La contraseña es requerida';
    }

    if (minlength) {
      return 'Su contraseña debe tener mínimo 8 caracteres';
    }

    if (pattern) {
      return 'Su contraseña debe contener al menos una letra minúscula , una letra mayúscula y un carácter especial';
    }
  }

  async logIn() {
    try {
      const email = this.formGroup.get('email').value;
      const password = this.formGroup.get('password').value;

      const user = await this.authenticationService.signInWithEmailAndPassword(email, password);

      if (user) {
        console.log('logeado');
      }
    }
    catch (error) {
      const { message } = error;

      if (message) {
        console.log('Correo electronico o Password incorrecto');
      }
      else {
        console.log('Ha ocurrido un error inesperado');
      }
    }
  }
}
