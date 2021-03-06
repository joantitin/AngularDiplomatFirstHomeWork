import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserModel } from '../Models/user-model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Municipality } from '../Models/municipality-model';
import { MunicipityService } from '../Services/municipity.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formGroup: FormGroup;
  municipalities: Array<Municipality>;

  constructor(
    private formBuilder: FormBuilder,
    private angularFirestoreService: AngularFirestore,
    private authenticationService: AngularFireAuth,
    private toastService: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private municipityService: MunicipityService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.maxLength(20)]],
      identificationNumber: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(80)]],
      sector: ['', [Validators.required, Validators.maxLength(30)]],
      municipity: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      repeatPassword: ''
    },
      { validators: this.validateRepeatPassword('password', 'repeatPassword') });

    this.spinner.show();

    this.municipityService.getAllMunicipities().then(municipities => {
      this.municipalities = municipities;
      this.spinner.hide();
    }).catch(() => {
      this.spinner.hide();
      this.toastService.error('No se pudieron cargar los municipios', 'Ha ocurrido un error inesperado');
    });

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
    const { required, maxlength } = this.formGroup.get('lastname').errors;

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
    const { required, maxlength } = this.formGroup.get('phoneNumber').errors;

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

      const { email, password } = this.formGroup.value;

      const { user } = await this.authenticationService.createUserWithEmailAndPassword(email, password);
      const userToCreate = this.buildUser(user.uid);
      await this.userService.create(userToCreate);

      this.router.navigate(['/home']);
      this.spinner.hide();
    }
    catch (error) {
      this.spinner.hide();
      this.toastService.error('Este usuario no se puede registrar en el sistema porque fue eliminado',
        'Ha ocurrido un error inesperado');
    }
  }

  onlyNumbers(event) {
    if (event.which >= 48 && event.which <= 57) {
      return true;
    } else {
      return false;
    }
  }




  private buildUser(id: string): UserModel {
    const { name, lastname, email, identificationNumber, phoneNumber, address, sector, municipity } = this.formGroup.value;

    const user: UserModel = {
      userId: id, name, lastname, email, identificationNumber, phoneNumber, address,
      sector, municipalityId: municipity
    };

    return user;
  }

}
