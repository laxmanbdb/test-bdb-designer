# AngularJS 1.x to Angular 16 Migration Plan

## Overview
This document outlines the step-by-step migration process for converting the BizViz Dashboard Designer from AngularJS 1.x to Angular 16 with standalone components.

## Current Architecture Analysis
- **Controllers**: 14 controllers (DesignerController, MainMenuController, etc.)
- **Services/Factories**: 2 factories (DesignerFactory, ServiceFactory)
- **Directives**: 4 directives (DesignerDirective, PropertyDirective, etc.)
- **Routing**: AngularJS ngRoute
- **HTTP**: $http service
- **Data Binding**: $scope-based two-way binding
- **Dependencies**: jQuery, Bootstrap, Angular Material, CodeMirror, etc.

## Migration Strategy: Hybrid Approach

### Phase 1: Setup Angular 16 Environment
1. Create new Angular 16 project with standalone components
2. Configure hybrid setup with ngUpgrade
3. Set up build system and dependencies

### Phase 2: Core Infrastructure Migration
1. Migrate services and factories to Angular services
2. Set up Angular routing alongside ngRoute
3. Configure HTTP client and interceptors

### Phase 3: Component Migration (Incremental)
1. Migrate simple components first (PropertyController, HelpController)
2. Migrate complex components (DesignerController, MainMenuController)
3. Convert directives to Angular components/directives

### Phase 4: Testing and Optimization
1. Migrate tests from Jasmine/Karma to Jest
2. Performance optimization
3. Remove AngularJS dependencies

## Detailed Migration Steps

### Step 1: Angular 16 Project Setup
```bash
# Create new Angular 16 project
ng new dashboard-designer-angular --standalone --routing --style=scss

# Install ngUpgrade for hybrid mode
npm install @angular/upgrade
```

### Step 2: Hybrid Configuration
- Configure AngularJS and Angular to run side-by-side
- Set up module downgrade/upgrade bridges
- Configure shared services

### Step 3: Service Migration
- Convert ServiceFactory to Angular @Injectable() service
- Migrate HTTP calls from $http to HttpClient
- Update dependency injection patterns

### Step 4: Component Migration
- Convert controllers to Angular components
- Replace $scope with component properties
- Migrate templates to Angular syntax

### Step 5: Routing Migration
- Set up Angular Router alongside ngRoute
- Migrate route configurations
- Update navigation patterns

### Step 6: Testing Migration
- Convert Jasmine/Karma tests to Jest
- Update TestBed configurations
- Migrate test utilities

## File Structure After Migration
```
src/
├── app/
│   ├── components/
│   │   ├── designer/
│   │   ├── main-menu/
│   │   ├── property-panel/
│   │   └── file-explorer/
│   ├── services/
│   │   ├── designer.service.ts
│   │   ├── auth.service.ts
│   │   └── http.service.ts
│   ├── models/
│   ├── shared/
│   └── app.component.ts
├── assets/
├── environments/
└── legacy/  # AngularJS files during migration
```

## Migration Timeline
- **Week 1-2**: Setup and infrastructure
- **Week 3-6**: Service and core component migration
- **Week 7-10**: Complex component migration
- **Week 11-12**: Testing and optimization
- **Week 13**: Cleanup and deployment

## Risk Mitigation
- Maintain hybrid mode until all components are migrated
- Comprehensive testing at each phase
- Rollback plan for each migration step
- Performance monitoring throughout migration