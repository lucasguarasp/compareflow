import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CompareFlowComponent } from '../draw-flow/compare-flow/compare-flow.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'Home', breadcrumb: ['Home'] },
    children: [
      {
        path: 'compare',
        component: CompareFlowComponent,
        data: { title: 'Compare Flow', breadcrumb: ['Compare Flow'] }
      },
      {
        path: 'compare/:flowId/:compareFlowId',
        component: CompareFlowComponent,
        data: { title: 'Compare Flow', breadcrumb: ['Compare Flow'] }
      }
    ]
  }
];

export const MainRouteRoutes = RouterModule.forChild(routes);
