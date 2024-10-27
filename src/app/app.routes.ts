import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        loadChildren:()=>import('./modules/login/login.module').then(m=>m.LoginModule)
    },
    {
        path:'register',
        loadChildren:()=>import('./modules/register/register.module').then(m=>m.RegisterModule)
    },
    {
        path:'admin',
        loadChildren:()=>import('./modules/admin/admin.module').then(m=>m.AdminModule)
    },
    {
        path:'user',
        loadChildren:()=>import('./modules/user/user.module').then(m=>m.UserModule)
    },
    {
        path: "**",
        redirectTo: '/'
    },
]||[];