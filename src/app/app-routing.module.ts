import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OlapComponent } from './olap/olap.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: "olap",
    component: OlapComponent
  },
  {
    path: "",
    component: WelcomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
