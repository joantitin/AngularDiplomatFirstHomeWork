import { Component, OnInit, Inject } from '@angular/core';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/app/Models/user-model';
import { UserService } from 'src/app/Services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<LogoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserModel, private userService: UserService,
    private spinner: NgxSpinnerService, private toastService: ToastrService) { }

  ngOnInit(): void {
  }

  async delete() {
    try {
      this.spinner.show();
      await this.userService.delete(this.user.userId);
      this.spinner.hide();
      this.toastService.success('Se elimino el usuario correctamente', 'Exito!');
      this.dialog.close();
    }
    catch {
      this.spinner.hide();
      this.toastService.error('No se pudo eliminar el usuario', 'Ha ocurrido un error inesperado');
    }
  }

}
