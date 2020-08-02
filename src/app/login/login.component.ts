import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
      return 'El correo electronico es requerido';
    }

    if (email) {
      return 'Digite un correo electronico valido';
    }
  }

  getPasswordError(): string {
    const { required, minlength, pattern } = this.formGroup.get('password').errors;

    if (required) {
      return 'La contraseña es requerida';
    }

    if (minlength) {
      return 'Su contraseña debe tener minimo 8 caracteres';
    }

    if (pattern) {
      return 'Su contraseña debe contener al menos una letra minuscula , una letra mayuscula y un caracter especial';
    }
  }
}
