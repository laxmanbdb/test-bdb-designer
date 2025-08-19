import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DesignerService } from '../../services/designer.service';
import { PropertyPanelComponent } from '../property-panel/property-panel.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { Subject, takeUntil } from 'rxjs';

export interface DesignerConfig {
  width: number;
  height: number;
  theme: 'light' | 'dark';
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoomLevel: number;
  selectedTool: string;
}

export interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: { [key: string]: any };
  selected: boolean;
}

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressBarModule,
    PropertyPanelComponent,
    MainMenuComponent
  ],
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit, OnDestroy {
  @ViewChild('designerCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('propertyPanel') propertyPanel!: PropertyPanelComponent;
  @ViewChild('mainMenu') mainMenu!: MainMenuComponent;

  // Component properties (replacing $scope variables)
  config: DesignerConfig = {
    width: 1200,
    height: 800,
    theme: 'light',
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    zoomLevel: 100,
    selectedTool: 'select'
  };

  canvasObjects: CanvasObject[] = [];
  selectedObject: CanvasObject | null = null;
  isDragging = false;
  dragStartPos = { x: 0, y: 0 };
  currentMousePos = { x: 0, y: 0 };
  
  // UI State
  isMainMenuVisible = true;
  isPropertyPanelVisible = true;
  isLoading = false;
  errorMessage = '';
  
  // Canvas context
  private ctx!: CanvasRenderingContext2D;
  private destroy$ = new Subject<void>();

  constructor(
    private designerService: DesignerService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeCanvas();
    this.setupEventListeners();
    this.loadDesignerConfig();
    this.startRenderLoop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize canvas and context
   */
  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = this.config.width;
    canvas.height = this.config.height;
    
    // Set canvas style
    canvas.style.width = `${this.config.width}px`;
    canvas.style.height = `${this.config.height}px`;
  }

  /**
   * Setup event listeners for canvas interactions
   */
  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('click', this.onCanvasClick.bind(this));
    
    // Keyboard events
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Load designer configuration from service
   */
  private loadDesignerConfig(): void {
    this.isLoading = true;
    
    this.designerService.get('/designer/config')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          this.config = { ...this.config, ...config };
          this.isLoading = false;
          this.initializeCanvas();
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoading = false;
          this.designerService.showNotification('Failed to load designer config', 'error');
        }
      });
  }

  /**
   * Start the render loop for canvas updates
   */
  private startRenderLoop(): void {
    const render = () => {
      this.renderCanvas();
      requestAnimationFrame(render);
    };
    render();
  }

  /**
   * Render the canvas with all objects and grid
   */
  private renderCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw grid if enabled
    if (this.config.showGrid) {
      this.drawGrid();
    }
    
    // Draw all objects
    this.canvasObjects.forEach(obj => {
      this.drawObject(obj);
    });
    
    // Draw selection rectangle
    if (this.isDragging) {
      this.drawSelectionRectangle();
    }
  }

  /**
   * Draw background
   */
  private drawBackground(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    
    ctx.fillStyle = this.config.theme === 'dark' ? '#2c2c2c' : '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Draw grid
   */
  private drawGrid(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const gridSize = this.config.gridSize;
    
    ctx.strokeStyle = this.config.theme === 'dark' ? '#404040' : '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  /**
   * Draw a canvas object
   */
  private drawObject(obj: CanvasObject): void {
    const ctx = this.ctx;
    
    ctx.save();
    
    // Set object properties
    ctx.fillStyle = obj.properties.fillColor || '#ffffff';
    ctx.strokeStyle = obj.selected ? '#2196f3' : (obj.properties.strokeColor || '#000000');
    ctx.lineWidth = obj.selected ? 3 : (obj.properties.strokeWidth || 1);
    
    // Draw based on object type
    switch (obj.type) {
      case 'rectangle':
        this.drawRectangle(obj);
        break;
      case 'circle':
        this.drawCircle(obj);
        break;
      case 'text':
        this.drawText(obj);
        break;
      default:
        this.drawRectangle(obj);
    }
    
    // Draw selection handles if selected
    if (obj.selected) {
      this.drawSelectionHandles(obj);
    }
    
    ctx.restore();
  }

  /**
   * Draw rectangle object
   */
  private drawRectangle(obj: CanvasObject): void {
    const ctx = this.ctx;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
  }

  /**
   * Draw circle object
   */
  private drawCircle(obj: CanvasObject): void {
    const ctx = this.ctx;
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const radius = Math.min(obj.width, obj.height) / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Draw text object
   */
  private drawText(obj: CanvasObject): void {
    const ctx = this.ctx;
    const text = obj.properties.text || '';
    const fontSize = obj.properties.fontSize || 16;
    const fontFamily = obj.properties.fontFamily || 'Arial';
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = obj.properties.textColor || '#000000';
    ctx.fillText(text, obj.x, obj.y + fontSize);
  }

  /**
   * Draw selection handles
   */
  private drawSelectionHandles(obj: CanvasObject): void {
    const ctx = this.ctx;
    const handleSize = 6;
    
    ctx.fillStyle = '#2196f3';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Corner handles
    const handles = [
      { x: obj.x, y: obj.y }, // Top-left
      { x: obj.x + obj.width, y: obj.y }, // Top-right
      { x: obj.x + obj.width, y: obj.y + obj.height }, // Bottom-right
      { x: obj.x, y: obj.y + obj.height } // Bottom-left
    ];
    
    handles.forEach(handle => {
      ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
    });
  }

  /**
   * Draw selection rectangle during drag
   */
  private drawSelectionRectangle(): void {
    const ctx = this.ctx;
    const width = this.currentMousePos.x - this.dragStartPos.x;
    const height = this.currentMousePos.y - this.dragStartPos.y;
    
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(this.dragStartPos.x, this.dragStartPos.y, width, height);
    ctx.setLineDash([]);
  }

  /**
   * Handle mouse down event
   */
  private onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.dragStartPos = { x, y };
    this.currentMousePos = { x, y };
    this.isDragging = true;
    
    // Check if clicking on an object
    const clickedObject = this.getObjectAtPosition(x, y);
    if (clickedObject) {
      this.selectObject(clickedObject);
    } else {
      this.clearSelection();
    }
  }

  /**
   * Handle mouse move event
   */
  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.currentMousePos = { x, y };
    
    // Update cursor based on tool
    this.updateCursor(x, y);
  }

  /**
   * Handle mouse up event
   */
  private onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
  }

  /**
   * Handle canvas click event
   */
  private onCanvasClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Handle tool actions
    switch (this.config.selectedTool) {
      case 'select':
        // Selection is handled in onMouseDown
        break;
      case 'rectangle':
        this.addRectangle(x, y);
        break;
      case 'circle':
        this.addCircle(x, y);
        break;
      case 'text':
        this.addText(x, y);
        break;
    }
  }

  /**
   * Handle key down event
   */
  @HostListener('document:keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        this.deleteSelectedObject();
        break;
      case 'Escape':
        this.clearSelection();
        break;
      case 'Ctrl+z':
        event.preventDefault();
        this.undo();
        break;
      case 'Ctrl+y':
        event.preventDefault();
        this.redo();
        break;
    }
  }

  /**
   * Get object at specific position
   */
  private getObjectAtPosition(x: number, y: number): CanvasObject | null {
    // Check objects in reverse order (top to bottom)
    for (let i = this.canvasObjects.length - 1; i >= 0; i--) {
      const obj = this.canvasObjects[i];
      if (x >= obj.x && x <= obj.x + obj.width &&
          y >= obj.y && y <= obj.y + obj.height) {
        return obj;
      }
    }
    return null;
  }

  /**
   * Select an object
   */
  private selectObject(obj: CanvasObject): void {
    this.clearSelection();
    obj.selected = true;
    this.selectedObject = obj;
    
    // Update property panel
    if (this.propertyPanel) {
      this.propertyPanel.selectedObject = obj;
      this.propertyPanel.properties = this.getObjectProperties(obj);
    }
  }

  /**
   * Clear selection
   */
  private clearSelection(): void {
    this.canvasObjects.forEach(obj => obj.selected = false);
    this.selectedObject = null;
    
    if (this.propertyPanel) {
      this.propertyPanel.selectedObject = null;
    }
  }

  /**
   * Update cursor based on position and tool
   */
  private updateCursor(x: number, y: number): void {
    const canvas = this.canvasRef.nativeElement;
    
    if (this.config.selectedTool === 'select') {
      const obj = this.getObjectAtPosition(x, y);
      canvas.style.cursor = obj ? 'pointer' : 'default';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }

  /**
   * Add rectangle object
   */
  private addRectangle(x: number, y: number): void {
    const obj: CanvasObject = {
      id: this.generateId(),
      type: 'rectangle',
      x: this.snapToGrid(x),
      y: this.snapToGrid(y),
      width: 100,
      height: 60,
      properties: {
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 1
      },
      selected: false
    };
    
    this.canvasObjects.push(obj);
    this.selectObject(obj);
  }

  /**
   * Add circle object
   */
  private addCircle(x: number, y: number): void {
    const obj: CanvasObject = {
      id: this.generateId(),
      type: 'circle',
      x: this.snapToGrid(x),
      y: this.snapToGrid(y),
      width: 80,
      height: 80,
      properties: {
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 1
      },
      selected: false
    };
    
    this.canvasObjects.push(obj);
    this.selectObject(obj);
  }

  /**
   * Add text object
   */
  private addText(x: number, y: number): void {
    const text = prompt('Enter text:') || 'Text';
    const obj: CanvasObject = {
      id: this.generateId(),
      type: 'text',
      x: this.snapToGrid(x),
      y: this.snapToGrid(y),
      width: text.length * 8,
      height: 20,
      properties: {
        text: text,
        fontSize: 16,
        fontFamily: 'Arial',
        textColor: '#000000'
      },
      selected: false
    };
    
    this.canvasObjects.push(obj);
    this.selectObject(obj);
  }

  /**
   * Delete selected object
   */
  private deleteSelectedObject(): void {
    if (this.selectedObject) {
      const index = this.canvasObjects.findIndex(obj => obj.id === this.selectedObject!.id);
      if (index !== -1) {
        this.canvasObjects.splice(index, 1);
        this.clearSelection();
      }
    }
  }

  /**
   * Undo last action
   */
  private undo(): void {
    // Implementation for undo functionality
    this.designerService.showNotification('Undo functionality not implemented yet', 'info');
  }

  /**
   * Redo last action
   */
  private redo(): void {
    // Implementation for redo functionality
    this.designerService.showNotification('Redo functionality not implemented yet', 'info');
  }

  /**
   * Snap coordinate to grid
   */
  private snapToGrid(coord: number): number {
    if (this.config.snapToGrid) {
      return Math.round(coord / this.config.gridSize) * this.config.gridSize;
    }
    return coord;
  }

  /**
   * Generate unique ID for objects
   */
  private generateId(): string {
    return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get object properties for property panel
   */
  private getObjectProperties(obj: CanvasObject): any[] {
    const properties = [];
    
    // Common properties
    properties.push(
      { id: 'x', name: 'X Position', type: 'number', value: obj.x },
      { id: 'y', name: 'Y Position', type: 'number', value: obj.y },
      { id: 'width', name: 'Width', type: 'number', value: obj.width },
      { id: 'height', name: 'Height', type: 'number', value: obj.height }
    );
    
    // Type-specific properties
    switch (obj.type) {
      case 'rectangle':
      case 'circle':
        properties.push(
          { id: 'fillColor', name: 'Fill Color', type: 'color', value: obj.properties.fillColor },
          { id: 'strokeColor', name: 'Stroke Color', type: 'color', value: obj.properties.strokeColor },
          { id: 'strokeWidth', name: 'Stroke Width', type: 'number', value: obj.properties.strokeWidth, min: 0, max: 10 }
        );
        break;
      case 'text':
        properties.push(
          { id: 'text', name: 'Text', type: 'text', value: obj.properties.text },
          { id: 'fontSize', name: 'Font Size', type: 'number', value: obj.properties.fontSize, min: 8, max: 72 },
          { id: 'fontFamily', name: 'Font Family', type: 'select', value: obj.properties.fontFamily, 
            options: [
              { value: 'Arial', label: 'Arial' },
              { value: 'Helvetica', label: 'Helvetica' },
              { value: 'Times New Roman', label: 'Times New Roman' },
              { value: 'Courier New', label: 'Courier New' }
            ]
          },
          { id: 'textColor', name: 'Text Color', type: 'color', value: obj.properties.textColor }
        );
        break;
    }
    
    return properties;
  }

  /**
   * Toggle main menu visibility
   */
  toggleMainMenu(): void {
    this.isMainMenuVisible = !this.isMainMenuVisible;
  }

  /**
   * Toggle property panel visibility
   */
  togglePropertyPanel(): void {
    this.isPropertyPanelVisible = !this.isPropertyPanelVisible;
  }

  /**
   * Save designer state
   */
  saveDesigner(): void {
    this.isLoading = true;
    
    const designerData = {
      config: this.config,
      objects: this.canvasObjects
    };
    
    this.designerService.post('/designer/save', designerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.designerService.showNotification('Designer saved successfully', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message;
          this.designerService.showNotification('Failed to save designer', 'error');
        }
      });
  }

  /**
   * Check if there are advanced properties in a group
   */
  private hasAdvancedProperties(properties: any[]): boolean {
    return properties.some(prop => 
      prop.name.toLowerCase().includes('advanced') ||
      prop.name.toLowerCase().includes('debug') ||
      prop.name.toLowerCase().includes('experimental')
    );
  }
}