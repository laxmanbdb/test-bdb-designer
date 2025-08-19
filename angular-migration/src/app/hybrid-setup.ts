import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Angular Services
import { DesignerService } from './services/designer.service';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';

// Angular Components
import { AppComponent } from './app.component';
import { DesignerComponent } from './components/designer/designer.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';

// Routes
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    MainMenuComponent,
    PropertyPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    UpgradeModule
  ],
  providers: [
    DesignerService,
    AuthService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}

  ngDoBootstrap() {
    // Bootstrap AngularJS app
    this.upgrade.bootstrap(document.body, ['designer'], { strictDi: true });
  }
}

// Factory for downgrading Angular services to AngularJS
export function downgradeService(serviceClass: any, name: string) {
  return {
    provide: name,
    useFactory: (injector: any) => injector.get(serviceClass),
    deps: ['$injector']
  };
}

// Factory for upgrading AngularJS services to Angular
export function upgradeService(serviceName: string) {
  return {
    provide: serviceName,
    useFactory: (injector: any) => injector.get(serviceName),
    deps: ['$injector']
  };
}