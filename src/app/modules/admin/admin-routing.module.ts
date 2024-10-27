import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookInventoryComponent } from './book-inventory/book-inventory.component';
import { UserProfilesComponent } from './user-profiles/user-profiles.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {path:'', redirectTo:'book-inventory', pathMatch:'full'},
  {path:'book-inventory', component:BookInventoryComponent},
  {path:'user-profiles', component:UserProfilesComponent},
  {path:'transactions', component:TransactionsComponent},
  { path: '**', redirectTo: '' } 
] || [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
    static routes: Routes | undefined;
}
