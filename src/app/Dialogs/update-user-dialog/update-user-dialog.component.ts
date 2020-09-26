import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Municipality } from 'src/app/Models/municipality-model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MunicipityService } from 'src/app/Services/municipity.service';
import { UserService } from 'src/app/Services/user.service';
import { UserModel } from 'src/app/Models/user-model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css']
})
export class UpdateUserDialogComponent implements OnInit {

  formGroup: FormGroup;
  municipalities: Array<Municipality>;

  constructor(
    private dialog: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserModel,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService,
    private municipityService: MunicipityService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.formGroup = this.formBuilder.group({
      name: [this.user.name, [Validators.required, Validators.maxLength(20)]],
      lastname: [this.user.lastname, [Validators.required, Validators.maxLength(20)]],
      identificationNumber: [this.user.identificationNumber, [Validators.required, Validators.maxLength(11)]],
      email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email, Validators.maxLength(50)]],
      phoneNumber: [this.user.phoneNumber, [Validators.required, Validators.maxLength(10)]],
      address: [this.user.address, [Validators.required, Validators.maxLength(80)]],
      sector: [this.user.sector, [Validators.required, Validators.maxLength(30)]],
      municipity: [this.user.municipality.municipalityId, Validators.required],
    });

    this.municipityService.getAllMunicipities().then(municipities => {
      this.municipalities = municipities;
      this.spinner.hide();
    }).catch(() => {
      this.spinner.hide();
      this.toastService.error('No se pudieron cargar los municipios', 'Ha ocurrido un error inesperado');
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

  async updateUser() {
    try {
      this.spinner.show();
      const user = this.buildUser();
      await this.userService.update(user);
      this.spinner.hide();
      this.toastService.success('Se actualizo el usuario correctamente', 'Exito!');
      this.dialog.close();
    }
    catch {
      this.spinner.hide();
      this.toastService.error('No se pudo actualizar el usuario', 'Ha ocurrido un error inesperado');
    }
  }

  private buildUser(): UserModel {
    const { name, lastname, email, identificationNumber, phoneNumber, address, sector, municipity } = this.formGroup.value;

    const user: UserModel = {
      userId: this.user.userId, name, lastname, email, identificationNumber, phoneNumber, address,
      sector, municipalityId: municipity
    };

    return user;
  }

}
