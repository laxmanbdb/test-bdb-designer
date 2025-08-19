#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Migration script to convert AngularJS controllers to Angular components
 * Usage: node scripts/migrate-controller.js <controller-file-path>
 */

class ControllerMigrator {
  constructor() {
    this.imports = new Set();
    this.dependencies = new Map();
    this.templateBindings = new Map();
  }

  /**
   * Main migration function
   */
  migrateController(filePath) {
    console.log(`Migrating controller: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const controllerName = this.extractControllerName(content);
    const componentName = this.convertToComponentName(controllerName);
    
    console.log(`Converting ${controllerName} to ${componentName}`);

    // Parse AngularJS controller
    const parsed = this.parseAngularJSController(content);
    
    // Generate Angular component
    const componentCode = this.generateAngularComponent(parsed, componentName);
    
    // Generate component template
    const templateCode = this.generateComponentTemplate(parsed);
    
    // Generate component styles
    const stylesCode = this.generateComponentStyles(componentName);
    
    // Create component directory
    const componentDir = this.createComponentDirectory(componentName);
    
    // Write files
    this.writeComponentFiles(componentDir, componentName, componentCode, templateCode, stylesCode);
    
    // Generate test file
    this.generateTestFile(componentDir, componentName, parsed);
    
    console.log(`Migration completed for ${componentName}`);
    console.log(`Files created in: ${componentDir}`);
  }

  /**
   * Extract controller name from file content
   */
  extractControllerName(content) {
    const match = content.match(/\.controller\(['"`]([^'"`]+)['"`]/);
    return match ? match[1] : 'UnknownController';
  }

  /**
   * Convert controller name to component name
   */
  convertToComponentName(controllerName) {
    return controllerName
      .replace(/Controller$/, '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Parse AngularJS controller content
   */
  parseAngularJSController(content) {
    const parsed = {
      name: '',
      dependencies: [],
      properties: [],
      methods: [],
      watchers: [],
      lifecycle: [],
      template: '',
      scope: {}
    };

    // Extract controller name
    const nameMatch = content.match(/\.controller\(['"`]([^'"`]+)['"`]/);
    if (nameMatch) {
      parsed.name = nameMatch[1];
    }

    // Extract dependencies
    const depsMatch = content.match(/function\s*\(([^)]+)\)/);
    if (depsMatch) {
      parsed.dependencies = depsMatch[1].split(',').map(dep => dep.trim());
    }

    // Extract $scope properties and methods
    const scopeMatches = content.match(/\$scope\.(\w+)\s*=\s*([^;]+);/g);
    if (scopeMatches) {
      scopeMatches.forEach(match => {
        const propMatch = match.match(/\$scope\.(\w+)\s*=\s*([^;]+);/);
        if (propMatch) {
          const [, name, value] = propMatch;
          parsed.properties.push({
            name,
            value: value.trim(),
            type: this.inferPropertyType(value)
          });
        }
      });
    }

    // Extract methods
    const methodMatches = content.match(/\$scope\.(\w+)\s*=\s*function\s*\([^)]*\)\s*\{[^}]+\}/g);
    if (methodMatches) {
      methodMatches.forEach(match => {
        const methodMatch = match.match(/\$scope\.(\w+)\s*=\s*function/);
        if (methodMatch) {
          parsed.methods.push({
            name: methodMatch[1],
            body: this.extractMethodBody(match)
          });
        }
      });
    }

    // Extract watchers
    const watcherMatches = content.match(/\$scope\.\$watch\([^)]+\)/g);
    if (watcherMatches) {
      watcherMatches.forEach(match => {
        parsed.watchers.push(match);
      });
    }

    return parsed;
  }

  /**
   * Infer property type from value
   */
  inferPropertyType(value) {
    const trimmed = value.trim();
    
    if (trimmed === 'true' || trimmed === 'false') return 'boolean';
    if (trimmed.match(/^\d+$/)) return 'number';
    if (trimmed.match(/^['"`].*['"`]$/)) return 'string';
    if (trimmed.match(/^\[.*\]$/)) return 'array';
    if (trimmed.match(/^\{.*\}$/)) return 'object';
    
    return 'any';
  }

  /**
   * Extract method body
   */
  extractMethodBody(methodString) {
    const start = methodString.indexOf('{');
    const end = methodString.lastIndexOf('}');
    return methodString.substring(start + 1, end).trim();
  }

  /**
   * Generate Angular component TypeScript code
   */
  generateAngularComponent(parsed, componentName) {
    const className = this.toPascalCase(componentName);
    
    let imports = [
      'import { Component, OnInit, OnDestroy } from \'@angular/core\';',
      'import { CommonModule } from \'@angular/common\';',
      'import { FormBuilder, FormGroup, ReactiveFormsModule } from \'@angular/forms\';',
      'import { Subject, takeUntil } from \'rxjs\';'
    ];

    // Add Material imports if needed
    if (this.needsMaterialImports(parsed)) {
      imports.push('import { MatButtonModule } from \'@angular/material/button\';');
      imports.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      imports.push('import { MatInputModule } from \'@angular/material/input\';');
    }

    // Add service imports
    if (parsed.dependencies.includes('ServiceFactory')) {
      imports.push('import { DesignerService } from \'../../services/designer.service\';');
    }

    const properties = parsed.properties.map(prop => 
      `  ${prop.name}: ${prop.type} = ${prop.value};`
    ).join('\n');

    const methods = parsed.methods.map(method => 
      `  ${method.name}(): void {\n    ${method.body}\n  }`
    ).join('\n\n');

    const template = `
@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule${this.needsMaterialImports(parsed) ? ',\n    MatButtonModule,\n    MatFormFieldModule,\n    MatInputModule' : ''}
  ],
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.scss']
})
export class ${className}Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

${properties}

  constructor(
    private fb: FormBuilder${parsed.dependencies.includes('ServiceFactory') ? ',\n    private designerService: DesignerService' : ''}
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Initialize component logic here
  }

${methods}
}`;

    return imports.join('\n') + template;
  }

  /**
   * Generate component template
   */
  generateComponentTemplate(parsed) {
    let template = `<div class="${this.toKebabCase(parsed.name)}-container">\n`;
    
    // Add properties as template bindings
    parsed.properties.forEach(prop => {
      if (prop.type === 'boolean') {
        template += `  <div *ngIf="${prop.name}">\n`;
        template += `    <!-- ${prop.name} content -->\n`;
        template += `  </div>\n`;
      } else if (prop.type === 'string') {
        template += `  <div>{{ ${prop.name} }}</div>\n`;
      }
    });

    // Add methods as event handlers
    parsed.methods.forEach(method => {
      template += `  <button (click)="${method.name}()">${method.name}</button>\n`;
    });

    template += '</div>';
    return template;
  }

  /**
   * Generate component styles
   */
  generateComponentStyles(componentName) {
    return `.${componentName}-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 1rem 0;
}

.${componentName}-container button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.${componentName}-container button:hover {
  background-color: #0056b3;
}`;
  }

  /**
   * Generate test file
   */
  generateTestFile(componentDir, componentName, parsed) {
    const className = this.toPascalCase(componentName);
    
    const testContent = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ${className}Component } from './${componentName}.component';

describe('${className}Component', () => {
  let component: ${className}Component;
  let fixture: ComponentFixture<${className}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ${className}Component,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(${className}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

${parsed.methods.map(method => `  it('should call ${method.name}', () => {
    spyOn(component, '${method.name}');
    component.${method.name}();
    expect(component.${method.name}).toHaveBeenCalled();
  });`).join('\n\n')}
});`;

    fs.writeFileSync(path.join(componentDir, `${componentName}.component.spec.ts`), testContent);
  }

  /**
   * Create component directory
   */
  createComponentDirectory(componentName) {
    const componentDir = path.join(process.cwd(), 'src', 'app', 'components', componentName);
    
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    return componentDir;
  }

  /**
   * Write component files
   */
  writeComponentFiles(componentDir, componentName, componentCode, templateCode, stylesCode) {
    // Write component TypeScript file
    fs.writeFileSync(
      path.join(componentDir, `${componentName}.component.ts`),
      componentCode
    );

    // Write template file
    fs.writeFileSync(
      path.join(componentDir, `${componentName}.component.html`),
      templateCode
    );

    // Write styles file
    fs.writeFileSync(
      path.join(componentDir, `${componentName}.component.scss`),
      stylesCode
    );
  }

  /**
   * Check if component needs Material imports
   */
  needsMaterialImports(parsed) {
    return parsed.methods.some(method => 
      method.body.includes('dialog') || 
      method.body.includes('snackbar') ||
      method.body.includes('form')
    );
  }

  /**
   * Convert to PascalCase
   */
  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Convert to kebab-case
   */
  toKebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}

// CLI execution
if (require.main === module) {
  const migrator = new ControllerMigrator();
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: node scripts/migrate-controller.js <controller-file-path>');
    process.exit(1);
  }
  
  migrator.migrateController(filePath);
}

module.exports = ControllerMigrator;