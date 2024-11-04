import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MainModule } from './modules/main/main.module';
// import { AuthModule } from './modules/auth/auth.module';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => MainModule
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)

  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
