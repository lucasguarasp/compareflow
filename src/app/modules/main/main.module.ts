import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRouteRoutes } from './main-route.routing';
import { DrawFlowModule } from '../draw-flow/draw-flow.module';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MainRouteRoutes,
    SharedModule,
    DrawFlowModule,
  ],
  declarations: [MainComponent, MenuSidebarComponent, HeaderComponent, FooterComponent]
})
export class MainModule { }
