# AngularJS to Angular 16 Migration Examples

## 1. Controller to Component Migration

### Before (AngularJS Controller)
```javascript
// PropertyController.js
angular.module("designer")
.controller("PropertyController", function($scope, ServiceFactory) {
    $scope.selectedObject = null;
    $scope.properties = [];
    $scope.isVisible = true;
    
    $scope.onPropertyChange = function(property, value) {
        property.value = value;
        ServiceFactory.showNotification('Property updated', 'success');
    };
    
    $scope.toggleVisibility = function() {
        $scope.isVisible = !$scope.isVisible;
    };
    
    $scope.saveProperties = function() {
        ServiceFactory.post('/properties/save', {
            objectId: $scope.selectedObject.id,
            properties: $scope.properties
        }).then(function(response) {
            ServiceFactory.showNotification('Saved successfully', 'success');
        });
    };
});
```

### After (Angular Component)
```typescript
// property-panel.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerService } from '../../services/designer.service';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  templateUrl: './property-panel.component.html'
})
export class PropertyPanelComponent implements OnInit {
  @Input() selectedObject: any = null;
  @Input() properties: any[] = [];
  @Output() propertyChanged = new EventEmitter<{property: any, value: any}>();

  isVisible = true;

  constructor(private designerService: DesignerService) {}

  ngOnInit(): void {
    // Component initialization
  }

  onPropertyChange(property: any, value: any): void {
    property.value = value;
    this.propertyChanged.emit({ property, value });
    this.designerService.showNotification('Property updated', 'success');
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  saveProperties(): void {
    this.designerService.post('/properties/save', {
      objectId: this.selectedObject?.id,
      properties: this.properties
    }).subscribe({
      next: () => this.designerService.showNotification('Saved successfully', 'success'),
      error: (error) => this.designerService.showNotification('Save failed', 'error')
    });
  }
}
```

## 2. Service/Factory Migration

### Before (AngularJS Factory)
```javascript
// ServiceFactory.js
angular.module("designer")
.factory("ServiceFactory", function($http, $timeout) {
    var services = {};
    
    services.getJsonFileData = function(dataFile, sCallback, args, eCallback) {
        $http.get(dataFile, {cache: true})
        .then(function(response) {
            if (sCallback && typeof sCallback === "function") {
                sCallback(response.data, args);
            }
        }, function(error) {
            if (eCallback && typeof eCallback === "function") {
                eCallback(error.status, args);
            }
        });
    };
    
    services.showLoader = function(config) {
        $.blockUI({
            message: "<div class='loader'>Loading...</div>",
            timeout: config.timeout || 60000
        });
    };
    
    return services;
});
```

### After (Angular Service)
```typescript
// designer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  constructor(private http: HttpClient) {}

  getJsonFileData(dataFile: string): Observable<any> {
    return this.http.get(dataFile, { 
      headers: { 'Cache-Control': 'max-age=3600' } 
    }).pipe(
      timeout(30000),
      catchError(this.handleError)
    );
  }

  showLoader(config?: { timeout?: number }): void {
    const loaderElement = document.createElement('div');
    loaderElement.id = 'angular-loader';
    loaderElement.innerHTML = '<div class="loader">Loading...</div>';
    document.body.appendChild(loaderElement);

    if (config?.timeout) {
      setTimeout(() => this.hideLoader(), config.timeout);
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
```

## 3. Directive to Component Migration

### Before (AngularJS Directive)
```javascript
// DesignerDirective.js
angular.module("designer")
.directive("designerCanvas", function() {
    return {
        restrict: 'E',
        template: '<canvas id="designerCanvas"></canvas>',
        scope: {
            config: '=',
            objects: '='
        },
        link: function(scope, element, attrs) {
            var canvas = element.find('canvas')[0];
            var ctx = canvas.getContext('2d');
            
            scope.$watch('objects', function(newObjects) {
                renderCanvas(ctx, newObjects);
            }, true);
            
            function renderCanvas(ctx, objects) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                objects.forEach(function(obj) {
                    drawObject(ctx, obj);
                });
            }
        }
    };
});
```

### After (Angular Component)
```typescript
// designer.component.ts
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-designer',
  standalone: true,
  template: '<canvas #designerCanvas></canvas>'
})
export class DesignerComponent implements OnInit {
  @ViewChild('designerCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() config: any;
  @Input() objects: any[] = [];

  private ctx!: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.initializeCanvas();
  }

  ngOnChanges(): void {
    if (this.ctx) {
      this.renderCanvas();
    }
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.renderCanvas();
  }

  private renderCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.objects.forEach(obj => this.drawObject(obj));
  }

  private drawObject(obj: any): void {
    // Drawing logic
  }
}
```

## 4. Template Syntax Migration

### Before (AngularJS Template)
```html
<!-- AngularJS Template -->
<div ng-controller="PropertyController as vm">
    <div ng-show="vm.isVisible">
        <div ng-repeat="property in vm.properties">
            <label>{{ property.name }}</label>
            <input ng-model="property.value" 
                   ng-change="vm.onPropertyChange(property, property.value)"
                   ng-disabled="property.disabled">
        </div>
        <button ng-click="vm.saveProperties()" 
                ng-disabled="vm.isLoading">
            {{ vm.isLoading ? 'Saving...' : 'Save' }}
        </button>
    </div>
</div>
```

### After (Angular Template)
```html
<!-- Angular Template -->
<div>
    <div *ngIf="isVisible">
        <div *ngFor="let property of properties">
            <label>{{ property.name }}</label>
            <input [(ngModel)]="property.value" 
                   (ngModelChange)="onPropertyChange(property, property.value)"
                   [disabled]="property.disabled">
        </div>
        <button (click)="saveProperties()" 
                [disabled]="isLoading">
            {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
    </div>
</div>
```

## 5. Routing Migration

### Before (AngularJS ngRoute)
```javascript
// AngularJS routing
angular.module("designer")
.config(function($routeProvider) {
    $routeProvider
        .when('/designer', {
            templateUrl: 'views/designer.html',
            controller: 'DesignerController'
        })
        .when('/properties', {
            templateUrl: 'views/properties.html',
            controller: 'PropertyController'
        })
        .otherwise({
            redirectTo: '/designer'
        });
});
```

### After (Angular Router)
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { DesignerComponent } from './components/designer/designer.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';

export const routes: Routes = [
  {
    path: 'designer',
    component: DesignerComponent
  },
  {
    path: 'properties',
    component: PropertyPanelComponent
  },
  {
    path: '',
    redirectTo: '/designer',
    pathMatch: 'full'
  }
];
```

## 6. Testing Migration

### Before (AngularJS Jasmine/Karma)
```javascript
// PropertyController.spec.js
describe('PropertyController', function() {
    var $scope, $controller, ServiceFactory;
    
    beforeEach(module('designer'));
    
    beforeEach(inject(function(_$rootScope_, _$controller_, _ServiceFactory_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        ServiceFactory = _ServiceFactory_;
    }));
    
    it('should toggle visibility', function() {
        $controller('PropertyController', {
            $scope: $scope,
            ServiceFactory: ServiceFactory
        });
        
        $scope.isVisible = true;
        $scope.toggleVisibility();
        expect($scope.isVisible).toBe(false);
    });
});
```

### After (Angular Jest)
```typescript
// property-panel.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyPanelComponent } from './property-panel.component';
import { DesignerService } from '../../services/designer.service';

describe('PropertyPanelComponent', () => {
  let component: PropertyPanelComponent;
  let fixture: ComponentFixture<PropertyPanelComponent>;
  let designerService: jasmine.SpyObj<DesignerService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DesignerService', ['showNotification']);
    
    await TestBed.configureTestingModule({
      imports: [PropertyPanelComponent],
      providers: [
        { provide: DesignerService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyPanelComponent);
    component = fixture.componentInstance;
    designerService = TestBed.inject(DesignerService) as jasmine.SpyObj<DesignerService>;
  });

  it('should toggle visibility', () => {
    component.isVisible = true;
    component.toggleVisibility();
    expect(component.isVisible).toBe(false);
  });
});
```

## 7. Data Binding Migration

### Before (AngularJS Two-way Binding)
```html
<!-- AngularJS -->
<input ng-model="vm.propertyValue">
<div>{{ vm.propertyValue }}</div>
```

### After (Angular Two-way Binding)
```html
<!-- Angular -->
<input [(ngModel)]="propertyValue">
<div>{{ propertyValue }}</div>
```

### Before (AngularJS One-way Binding)
```html
<!-- AngularJS -->
<div ng-bind="vm.propertyValue"></div>
<img ng-src="{{ vm.imageUrl }}">
```

### After (Angular One-way Binding)
```html
<!-- Angular -->
<div [textContent]="propertyValue"></div>
<img [src]="imageUrl">
```

## 8. Event Handling Migration

### Before (AngularJS Events)
```html
<!-- AngularJS -->
<button ng-click="vm.handleClick()">Click</button>
<input ng-change="vm.handleChange()">
<form ng-submit="vm.handleSubmit()">
```

### After (Angular Events)
```html
<!-- Angular -->
<button (click)="handleClick()">Click</button>
<input (change)="handleChange()">
<form (ngSubmit)="handleSubmit()">
```

## 9. Filter to Pipe Migration

### Before (AngularJS Filter)
```html
<!-- AngularJS -->
<div>{{ vm.items | filter:vm.searchText }}</div>
<div>{{ vm.date | date:'yyyy-MM-dd' }}</div>
```

### After (Angular Pipe)
```html
<!-- Angular -->
<div>{{ items | filter:searchText }}</div>
<div>{{ date | date:'yyyy-MM-dd' }}</div>
```

## 10. Dependency Injection Migration

### Before (AngularJS DI)
```javascript
// AngularJS
angular.module("designer")
.controller("MyController", function($scope, $http, ServiceFactory) {
    // Controller logic
});
```

### After (Angular DI)
```typescript
// Angular
@Component({
  selector: 'app-my-component',
  standalone: true
})
export class MyComponent {
  constructor(
    private http: HttpClient,
    private designerService: DesignerService
  ) {}
}
```

## Migration Checklist

- [ ] Set up Angular 16 project with standalone components
- [ ] Configure hybrid setup with ngUpgrade
- [ ] Migrate services and factories to Angular services
- [ ] Convert controllers to Angular components
- [ ] Update templates with Angular syntax
- [ ] Migrate routing configuration
- [ ] Update data binding syntax
- [ ] Convert event handlers
- [ ] Migrate filters to pipes
- [ ] Update dependency injection
- [ ] Migrate tests from Jasmine/Karma to Jest
- [ ] Update build configuration
- [ ] Test hybrid functionality
- [ ] Remove AngularJS dependencies
- [ ] Optimize performance
- [ ] Update documentation