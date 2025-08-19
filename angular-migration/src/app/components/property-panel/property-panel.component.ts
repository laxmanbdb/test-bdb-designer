import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatColorPickerModule } from '@angular/material/color-picker';

import { DesignerService } from '../../services/designer.service';
import { Subject, takeUntil } from 'rxjs';

export interface PropertyConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'slider';
  value: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatColorPickerModule
  ],
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.scss']
})
export class PropertyPanelComponent implements OnInit, OnDestroy {
  @Input() selectedObject: any = null;
  @Input() properties: PropertyConfig[] = [];
  @Output() propertyChanged = new EventEmitter<{ property: PropertyConfig; value: any }>();
  @Output() propertyReset = new EventEmitter<PropertyConfig>();

  propertyForm: FormGroup;
  isVisible = true;
  isLoading = false;
  errorMessage = '';
  
  // Component properties (replacing $scope variables)
  propertyGroups: { [key: string]: PropertyConfig[] } = {};
  selectedPropertyGroup = '';
  showAdvancedProperties = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private designerService: DesignerService
  ) {
    this.propertyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.groupProperties();
    this.setupFormValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form with property controls
   */
  private initializeForm(): void {
    const formControls: { [key: string]: any } = {};
    
    this.properties.forEach(property => {
      const validators = [];
      if (property.required) {
        validators.push(Validators.required);
      }
      
      switch (property.type) {
        case 'number':
          validators.push(Validators.pattern(/^-?\d*\.?\d*$/));
          break;
        case 'text':
          validators.push(Validators.minLength(1));
          break;
      }
      
      formControls[property.id] = [
        { value: property.value, disabled: property.disabled },
        validators
      ];
    });
    
    this.propertyForm = this.fb.group(formControls);
  }

  /**
   * Group properties by category
   */
  private groupProperties(): void {
    this.propertyGroups = this.properties.reduce((groups, property) => {
      const group = this.getPropertyGroup(property);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(property);
      return groups;
    }, {} as { [key: string]: PropertyConfig[] });
    
    // Set default selected group
    const groupKeys = Object.keys(this.propertyGroups);
    this.selectedPropertyGroup = groupKeys.length > 0 ? groupKeys[0] : '';
  }

  /**
   * Get property group based on property name or type
   */
  private getPropertyGroup(property: PropertyConfig): string {
    const name = property.name.toLowerCase();
    
    if (name.includes('style') || name.includes('color') || name.includes('font')) {
      return 'Styling';
    } else if (name.includes('data') || name.includes('source')) {
      return 'Data';
    } else if (name.includes('layout') || name.includes('position')) {
      return 'Layout';
    } else if (name.includes('behavior') || name.includes('event')) {
      return 'Behavior';
    } else {
      return 'General';
    }
  }

  /**
   * Setup form value change listeners
   */
  private setupFormValueChanges(): void {
    this.propertyForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        Object.keys(values).forEach(propertyId => {
          const property = this.properties.find(p => p.id === propertyId);
          if (property && property.value !== values[propertyId]) {
            this.onPropertyChange(property, values[propertyId]);
          }
        });
      });
  }

  /**
   * Handle property value change
   */
  onPropertyChange(property: PropertyConfig, value: any): void {
    property.value = value;
    this.propertyChanged.emit({ property, value });
    
    // Show notification
    this.designerService.showNotification(
      `${property.name} updated to ${value}`,
      'success'
    );
  }

  /**
   * Reset property to default value
   */
  resetProperty(property: PropertyConfig): void {
    const defaultValue = this.getDefaultValue(property);
    this.propertyForm.patchValue({ [property.id]: defaultValue });
    this.propertyReset.emit(property);
  }

  /**
   * Get default value for property type
   */
  private getDefaultValue(property: PropertyConfig): any {
    switch (property.type) {
      case 'text':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'select':
        return property.options && property.options.length > 0 ? property.options[0].value : '';
      case 'color':
        return '#000000';
      case 'slider':
        return property.min || 0;
      default:
        return '';
    }
  }

  /**
   * Toggle property panel visibility
   */
  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  /**
   * Toggle advanced properties
   */
  toggleAdvancedProperties(): void {
    this.showAdvancedProperties = !this.showAdvancedProperties;
  }

  /**
   * Save properties to server
   */
  saveProperties(): void {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      const formData = this.propertyForm.value;
      
      this.designerService.post('/properties/save', {
        objectId: this.selectedObject?.id,
        properties: formData
      }).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.designerService.showNotification('Properties saved successfully', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message;
          this.designerService.showNotification('Failed to save properties', 'error');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.propertyForm.controls).forEach(key => {
      const control = this.propertyForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get properties for current group
   */
  getCurrentGroupProperties(): PropertyConfig[] {
    return this.propertyGroups[this.selectedPropertyGroup] || [];
  }

  /**
   * Check if property should be shown (filter advanced properties)
   */
  shouldShowProperty(property: PropertyConfig): boolean {
    if (!this.showAdvancedProperties && this.isAdvancedProperty(property)) {
      return false;
    }
    return true;
  }

  /**
   * Check if property is advanced
   */
  private isAdvancedProperty(property: PropertyConfig): boolean {
    const advancedKeywords = ['advanced', 'debug', 'experimental', 'internal'];
    return advancedKeywords.some(keyword => 
      property.name.toLowerCase().includes(keyword)
    );
  }

  /**
   * Get form control for property
   */
  getFormControl(propertyId: string) {
    return this.propertyForm.get(propertyId);
  }

  /**
   * Check if form control has error
   */
  hasError(propertyId: string, errorType: string): boolean {
    const control = this.getFormControl(propertyId);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}