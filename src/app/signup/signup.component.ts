import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserModel } from '../Models/user-model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private angularFirestoreService: AngularFirestore,
    private authenticationService: AngularFireAuth,
    private toastService: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.maxLength(20)]],
      identificationNumber: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(80)]],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      repeatPassword: ''
    },
      { validators: this.validateRepeatPassword('password', 'repeatPassword') });

    this.authenticationService.authState.toPromise().then(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    }).catch(() => {
      this.toastService.error('No se pudo conectar con firebase', 'Ha ocurrido un error inespoerado');
    });
  }

  getNameErrorMessage(): string {
    const { required, maxlength } = this.formGroup.get('name').errors;

    if (required) {
      return 'El nombre es requerido';
    }

    if (maxlength) {
      return 'El nombre no puede contener mas de 20 caracteres';
    }
  }

  getLastnameErrorMessage(): string {
    const { required, maxlength, email } = this.formGroup.get('lastname').errors;

    if (required) {
      return 'El apellido es requerido';
    }

    if (maxlength) {
      return 'El apellido no puede contener mas de 50 caracteres';
    }
  }

  getIdentificationNumberErrorMessage(): string {
    const { required, maxlength } = this.formGroup.get('identificationNumber').errors;

    if (required) {
      return 'La cedua es requerida';
    }

    if (maxlength) {
      return 'La cedula no puede contener mas de 11 caracteres';
    }
  }

  getEmailErrorMessage(): string {
    const { required, maxlength, email } = this.formGroup.get('email').errors;

    if (required) {
      return 'El email es requerido';
    }

    if (maxlength) {
      return 'El email no puede contener mas de 50 caracteres';
    }

    if (email) {
      return 'El email no contiene un formato valido';
    }
  }

  getPhoneErrorMessage(): string {
    const { required, maxlength } = this.formGroup.get('phone').errors;

    if (required) {
      return 'El telefono es requerido';
    }

    if (maxlength) {
      return 'El telefono no puede contener mas de 10 caracteres';
    }
  }

  getAddressErrorMessage(): string {
    const { required, maxlength } = this.formGroup.get('address').errors;

    if (required) {
      return 'La direccion es requerida';
    }

    if (maxlength) {
      return 'La direccion no puede contener mas de 80 caracteres';
    }
  }

  getPasswordErrorMessage(): string {
    const { required, pattern, minlength } = this.formGroup.get('password').errors;

    if (required) {
      return 'El password es requerido';
    }

    if (pattern) {
      return 'Su contraseña debe contener al menos una letra minúscula , una letra mayúscula y un carácter especial';
    }

    if (minlength) {
      return 'Su contraseña debe contener al menos 8 caracteres';
    }
  }

  validateRepeatPassword(controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  async createUser() {
    try {
      this.spinner.show();
      const userToCreate = this.buildUser();
      const { user } = await this.authenticationService.createUserWithEmailAndPassword(userToCreate.email, userToCreate.password);
      await this.angularFirestoreService.collection('users').doc(user.uid).set(userToCreate);
      this.router.navigate(['/home']);
      this.spinner.hide();
    }
    catch (error) {
      this.spinner.hide();
      this.toastService.error(error, 'Ha ocurrido un error inesperado');
    }

  }

  private buildUser(): UserModel {
    const name = this.formGroup.get('name').value;
    const lastname = this.formGroup.get('lastname').value;
    const email = this.formGroup.get('email').value;
    const identificationNumber = this.formGroup.get('identificationNumber').value;
    const phone = this.formGroup.get('phone').value;
    const address = this.formGroup.get('address').value;
    const password = this.formGroup.get('password').value;

    const user: UserModel = {
      name, lastname, email, identificationNumber, phone, address, password,
    };

    return user;
  }

}
