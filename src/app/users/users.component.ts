import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../Models/user-model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserDialogComponent } from '../Dialogs/delete-user-dialog/delete-user-dialog.component';
import { UpdateUserDialogComponent } from '../Dialogs/update-user-dialog/update-user-dialog.component';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'lastname', 'identificationNumber', 'address', 'email', 'phoneNumber', 'actions'];
  dataSource: MatTableDataSource<UserModel>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private userService: UserService, private toastService: ToastrService) { }

  ngOnInit(): void {

    this.userService.getAll().then(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.sort = this.sort;
    }).catch(() => {
      this.toastService.error('No se pudo consultar la base de datos', 'Ha ocurrido un error inesperado');
    });
  }

  openDeleteDialog(user: UserModel) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: user, disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openUpdateDialog(user: UserModel) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: user, disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
