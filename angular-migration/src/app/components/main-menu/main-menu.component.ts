import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { DesignerService } from '../../services/designer.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

export interface Language {
  locale: string;
  displayName: string;
}

export interface Workspace {
  key: string;
  name: string;
}

export interface ServerAlert {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  // Menu state
  isUserDropdownOpen = false;
  isUserAlertOpen = false;
  isUserNavigationOpen = false;
  searchVisible = false;
  controlDisable = false;

  // Dashboard properties
  recentlyClickedItem = '';
  newDashboardName = 'Untitled Dashboard';
  alreadyPublished = false;
  publishAction = 'PUB_OVERRIDE';
  pubInfoMsg = '';
  maxTabLength = 3;
  openProcessingItem = '';
  updateDashAction = '';

  // User and workspace
  selectedWorkspace: Workspace = { key: '', name: '' };
  selectedLanguage: Language = { locale: 'en-US', displayName: 'English(US)' };
  currentTheme = 'light';

  // Server alerts
  serverAlertMsg: ServerAlert = { text: '', type: 'info' };

  // Language options
  languageList: Language[] = [
    { locale: 'en-US', displayName: 'English(US)' },
    { locale: 'hi-IN', displayName: 'हिंदी(भारत)' }
  ];

  // Brand configuration
  brandConfig: any = {};
  scriptHelpUrl = '';
  designerHelpUrl = '';

  // Theme state
  darkMode = false;

  private destroy$ = new Subject<void>();

  constructor(
    private designerService: DesignerService,
    private authService: AuthService,
    private themeService: ThemeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.loadUserPreferences();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize component
   */
  private initializeComponent(): void {
    this.brandConfig = (window as any).app_brand_cfg || {};
    this.scriptHelpUrl = (window as any).dGlobals?.scriptHelpUrl || '';
    this.designerHelpUrl = (window as any).dGlobals?.designerHelpUrl || '';
    
    // Load workspace from session storage
    const selectedWorkspace = sessionStorage.getItem('workspace');
    if (selectedWorkspace) {
      const workspaceDetail = selectedWorkspace.split('_');
      this.selectedWorkspace = {
        key: workspaceDetail[0] || '',
        name: workspaceDetail[1] || ''
      };
    }

    // Load theme from session storage
    this.currentTheme = sessionStorage.getItem('theme') || 'light';
    this.darkMode = this.currentTheme === 'dark';
    this.applyTheme();
  }

  /**
   * Load user preferences
   */
  private loadUserPreferences(): void {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = this.languageList.find(lang => lang.locale === savedLanguage);
      if (language) {
        this.selectedLanguage = language;
      }
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.darkMode = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for theme changes
    this.themeService.themeChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
        this.darkMode = theme === 'dark';
      });
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    document.body.setAttribute('data-theme', this.currentTheme);
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    const theme = this.darkMode ? 'dark' : 'light';
    this.currentTheme = theme;
    
    this.applyTheme();
    localStorage.setItem('theme', theme);
    sessionStorage.setItem('theme', theme);
    
    this.themeService.setTheme(theme);
  }

  /**
   * Toggle user dropdown
   */
  toggleUserDropdown(): void {
    this.isUserAlertOpen = false;
    this.isUserNavigationOpen = false;
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  /**
   * Toggle user alert notification
   */
  toggleUserAlertNotification(): void {
    this.isUserDropdownOpen = false;
    this.isUserNavigationOpen = false;
    this.isUserAlertOpen = !this.isUserAlertOpen;
  }

  /**
   * Toggle user navigation
   */
  toggleUserNavigation(): void {
    this.isUserDropdownOpen = false;
    this.isUserAlertOpen = false;
    this.isUserNavigationOpen = !this.isUserNavigationOpen;
  }

  /**
   * Navigate to user notifications
   */
  userNotification(): void {
    this.router.navigate(['/notifications']);
  }

  /**
   * Handle user logout
   */
  userLogout(): void {
    const authInfo = this.authService.getAuthInfo();
    let signoutRoute = 'signin';
    
    if (authInfo?.user?.lite === true) {
      signoutRoute = 'lite-preview';
    }

    const headerSettings = (window as any).headerSettings;
    if (headerSettings?.signOuturl === 'default') {
      this.performLogout();
    } else {
      window.location.href = headerSettings.signOuturl;
    }
  }

  /**
   * Perform logout operation
   */
  private performLogout(): void {
    const authInfo = this.authService.getAuthInfo();
    
    this.designerService.post('/auth/logout', {
      token: authInfo.token
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.authService.clearAuthInfo();
        sessionStorage.clear();
        localStorage.clear();
        
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000
        });
        
        // Redirect to signin page
        window.location.href = '/signin';
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.snackBar.open('Logout failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Change language
   */
  changeLanguage(language: Language): void {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', language.locale);
    
    // Notify language service
    this.designerService.showNotification(
      `Language changed to ${language.displayName}`,
      'success'
    );
  }

  /**
   * Toggle search visibility
   */
  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
  }

  /**
   * Create new dashboard
   */
  createNewDashboard(): void {
    this.designerService.showNotification('Creating new dashboard...', 'info');
    // Implementation for creating new dashboard
  }

  /**
   * Open dashboard
   */
  openDashboard(): void {
    this.designerService.showNotification('Opening dashboard...', 'info');
    // Implementation for opening dashboard
  }

  /**
   * Save dashboard
   */
  saveDashboard(): void {
    this.designerService.showNotification('Saving dashboard...', 'info');
    // Implementation for saving dashboard
  }

  /**
   * Publish dashboard
   */
  publishDashboard(): void {
    if (this.alreadyPublished) {
      this.publishAction = 'PUB_OVERRIDE';
      this.pubInfoMsg = 'Dashboard will be overwritten';
    } else {
      this.publishAction = 'PUB_NEW';
      this.pubInfoMsg = 'New dashboard will be published';
    }
    
    this.designerService.showNotification('Publishing dashboard...', 'info');
    // Implementation for publishing dashboard
  }

  /**
   * Show help
   */
  showHelp(): void {
    if (this.designerHelpUrl) {
      window.open(this.designerHelpUrl, '_blank');
    }
  }

  /**
   * Show script help
   */
  showScriptHelp(): void {
    if (this.scriptHelpUrl) {
      window.open(this.scriptHelpUrl, '_blank');
    }
  }

  /**
   * Close all dropdowns
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close dropdowns if clicking outside
    if (!target.closest('.user-dropdown')) {
      this.isUserDropdownOpen = false;
    }
    
    if (!target.closest('.user-alert')) {
      this.isUserAlertOpen = false;
    }
    
    if (!target.closest('.user-navigation')) {
      this.isUserNavigationOpen = false;
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Ctrl+N: New dashboard
    if (event.ctrlKey && event.key === 'n') {
      event.preventDefault();
      this.createNewDashboard();
    }
    
    // Ctrl+O: Open dashboard
    if (event.ctrlKey && event.key === 'o') {
      event.preventDefault();
      this.openDashboard();
    }
    
    // Ctrl+S: Save dashboard
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.saveDashboard();
    }
    
    // Ctrl+P: Publish dashboard
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.publishDashboard();
    }
    
    // F1: Help
    if (event.key === 'F1') {
      event.preventDefault();
      this.showHelp();
    }
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    const authInfo = this.authService.getAuthInfo();
    return authInfo?.user?.name || 'User';
  }

  /**
   * Get user email
   */
  getUserEmail(): string {
    const authInfo = this.authService.getAuthInfo();
    return authInfo?.user?.email || '';
  }

  /**
   * Get user avatar
   */
  getUserAvatar(): string {
    const authInfo = this.authService.getAuthInfo();
    return authInfo?.user?.avatar || 'assets/images/default-avatar.png';
  }

  /**
   * Check if user has notifications
   */
  hasNotifications(): boolean {
    // Implementation to check for notifications
    return false;
  }

  /**
   * Get notification count
   */
  getNotificationCount(): number {
    // Implementation to get notification count
    return 0;
  }
}