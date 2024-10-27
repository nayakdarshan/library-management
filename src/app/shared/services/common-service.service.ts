import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(
    public snackBar: MatSnackBar,
  ) { }

  public displaySuccessSnackBar(message: any, status = 'success') {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: { status, message },
      panelClass: ["snackbar",status == 'success' ? 'success-snackbar' : 'failure-snackbar']
    });
  }
  public displayFailureSnackBar(message: any, status = 'failure') {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: { status, message },
      panelClass: ["snackbar",status == 'success' ? 'success-snackbar' : 'failure-snackbar']
    });
  }
}
