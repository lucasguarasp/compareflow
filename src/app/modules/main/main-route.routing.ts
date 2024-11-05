import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CompareFlowComponent } from '../draw-flow/compare-flow/compare-flow.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: CompareFlowComponent
      }
    ]
  }
];

export const MainRouteRoutes = RouterModule.forChild(routes);
