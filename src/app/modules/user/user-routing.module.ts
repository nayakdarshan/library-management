import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YourBorrowingsComponent } from './your-borrowings/your-borrowings.component';
import { BorrowBooksComponent } from './borrow-books/borrow-books.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
  {path:'', redirectTo:'your-borrowings', pathMatch:'full'},
  {path:'your-borrowings', component:YourBorrowingsComponent},
  {path:'borrow-book', component:BorrowBooksComponent},
  {path:'update-profile', component:UpdateProfileComponent},
  { path: '**', redirectTo: '' } 
] || [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
    static routes: Routes | undefined;
}
