import { Routes } from '@angular/router';
import { DesignerComponent } from './components/designer/designer.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/designer',
    pathMatch: 'full'
  },
  {
    path: 'designer',
    component: DesignerComponent,
    children: [
      {
        path: 'main-menu',
        component: MainMenuComponent
      },
      {
        path: 'property-panel',
        component: PropertyPanelComponent
      }
    ]
  },
  {
    path: 'legacy',
    // This route will handle AngularJS routes during migration
    loadChildren: () => import('./legacy/legacy.module').then(m => m.LegacyModule)
  },
  {
    path: '**',
    redirectTo: '/designer'
  }
];