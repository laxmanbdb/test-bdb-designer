import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { DesignerService } from './services/designer.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { DesignerComponent } from './components/designer/designer.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MainMenuComponent,
    DesignerComponent,
    PropertyPanelComponent,
    FileExplorerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Dashboard Designer';
  
  // Layout state
  isMainMenuVisible = true;
  isPropertyPanelVisible = true;
  isFileExplorerVisible = false;
  isSidebarOpen = true;
  
  // Loading state
  isLoading = false;
  loadingMessage = '';
  
  // Error state
  errorMessage = '';
  
  // User state
  isAuthenticated = false;
  currentUser: any = null;
  
  // Theme state
  currentTheme = 'light';
  
  private destroy$ = new Subject<void>();

  constructor(
    private designerService: DesignerService,
    private authService: AuthService,
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeApp();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize application
   */
  private initializeApp(): void {
    this.checkAuthentication();
    this.setupTheme();
    this.loadApplicationConfig();
  }

  /**
   * Check user authentication
   */
  private checkAuthentication(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          this.redirectToLogin();
        }
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  /**
   * Setup theme
   */
  private setupTheme(): void {
    this.themeService.themeChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  /**
   * Load application configuration
   */
  private loadApplicationConfig(): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading application configuration...';

    this.designerService.get('/config')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          this.applyApplicationConfig(config);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load application configuration';
          this.isLoading = false;
          console.error('Failed to load config:', error);
        }
      });
  }

  /**
   * Apply application configuration
   */
  private applyApplicationConfig(config: any): void {
    // Apply layout configuration
    if (config.layout) {
      this.isMainMenuVisible = config.layout.showMainMenu !== false;
      this.isPropertyPanelVisible = config.layout.showPropertyPanel !== false;
      this.isFileExplorerVisible = config.layout.showFileExplorer === true;
      this.isSidebarOpen = config.layout.sidebarOpen !== false;
    }

    // Apply theme configuration
    if (config.theme) {
      this.themeService.setTheme(config.theme.defaultTheme || 'light');
    }

    // Apply user preferences
    if (config.userPreferences) {
      this.applyUserPreferences(config.userPreferences);
    }
  }

  /**
   * Apply user preferences
   */
  private applyUserPreferences(preferences: any): void {
    if (preferences.layout) {
      this.isMainMenuVisible = preferences.layout.showMainMenu !== false;
      this.isPropertyPanelVisible = preferences.layout.showPropertyPanel !== false;
      this.isFileExplorerVisible = preferences.layout.showFileExplorer === true;
    }

    if (preferences.theme) {
      this.themeService.setTheme(preferences.theme);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for global notifications
    this.designerService.getCurrentMessages();
    
    // Listen for authentication changes
    this.authService.authInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authInfo => {
        if (authInfo) {
          this.handleAuthInfoUpdate(authInfo);
        }
      });
  }

  /**
   * Handle authentication info updates
   */
  private handleAuthInfoUpdate(authInfo: any): void {
    // Update workspace information
    if (authInfo.spacekey) {
      sessionStorage.setItem('workspace', `${authInfo.spacekey}_${authInfo.user?.workspaceName || 'Default'}`);
    }

    // Update user preferences
    if (authInfo.user?.preferences) {
      this.applyUserPreferences(authInfo.user.preferences);
    }
  }

  /**
   * Redirect to login page
   */
  private redirectToLogin(): void {
    // Store current URL for redirect after login
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectUrl', currentUrl);
    
    // Redirect to login
    window.location.href = '/login';
  }

  /**
   * Toggle main menu visibility
   */
  toggleMainMenu(): void {
    this.isMainMenuVisible = !this.isMainMenuVisible;
    this.saveUserPreferences();
  }

  /**
   * Toggle property panel visibility
   */
  togglePropertyPanel(): void {
    this.isPropertyPanelVisible = !this.isPropertyPanelVisible;
    this.saveUserPreferences();
  }

  /**
   * Toggle file explorer visibility
   */
  toggleFileExplorer(): void {
    this.isFileExplorerVisible = !this.isFileExplorerVisible;
    this.saveUserPreferences();
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.saveUserPreferences();
  }

  /**
   * Save user preferences
   */
  private saveUserPreferences(): void {
    const preferences = {
      layout: {
        showMainMenu: this.isMainMenuVisible,
        showPropertyPanel: this.isPropertyPanelVisible,
        showFileExplorer: this.isFileExplorerVisible,
        sidebarOpen: this.isSidebarOpen
      },
      theme: this.currentTheme
    };

    // Save to local storage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // Save to server if user is authenticated
    if (this.isAuthenticated) {
      this.authService.updateProfile({ preferences })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Preferences saved successfully
          },
          error: (error) => {
            console.error('Failed to save preferences:', error);
            this.snackBar.open('Failed to save preferences', 'Close', { duration: 3000 });
          }
        });
    }
  }

  /**
   * Handle file selection from file explorer
   */
  onFileSelected(file: any): void {
    this.snackBar.open(`Selected file: ${file.name}`, 'Close', { duration: 2000 });
    // Handle file selection logic
  }

  /**
   * Handle folder selection from file explorer
   */
  onFolderSelected(folder: any): void {
    this.snackBar.open(`Selected folder: ${folder.name}`, 'Close', { duration: 2000 });
    // Handle folder selection logic
  }

  /**
   * Handle file upload from file explorer
   */
  onFileUploaded(file: any): void {
    this.snackBar.open(`File uploaded: ${file.name}`, 'Close', { duration: 3000 });
    // Handle file upload logic
  }

  /**
   * Handle property changes from property panel
   */
  onPropertyChanged(propertyChange: any): void {
    // Handle property change logic
    console.log('Property changed:', propertyChange);
  }

  /**
   * Handle property reset from property panel
   */
  onPropertyReset(property: any): void {
    this.snackBar.open(`Property reset: ${property.name}`, 'Close', { duration: 2000 });
    // Handle property reset logic
  }

  /**
   * Show loading indicator
   */
  showLoading(message: string): void {
    this.isLoading = true;
    this.loadingMessage = message;
  }

  /**
   * Hide loading indicator
   */
  hideLoading(): void {
    this.isLoading = false;
    this.loadingMessage = '';
  }

  /**
   * Show error message
   */
  showError(message: string): void {
    this.errorMessage = message;
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage = '';
  }

  /**
   * Get current user display name
   */
  getUserDisplayName(): string {
    return this.currentUser?.name || 'User';
  }

  /**
   * Get current user email
   */
  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return this.authService.hasAnyPermission(permissions);
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return this.authService.hasAllPermissions(permissions);
  }
}