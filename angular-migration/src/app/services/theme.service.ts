import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selectedTheme';
  private readonly DEFAULT_THEME: Theme = 'light';

  private currentThemeSubject = new BehaviorSubject<Theme>(this.DEFAULT_THEME);
  private themeConfigSubject = new BehaviorSubject<ThemeConfig>(this.getDefaultThemeConfig());

  public themeChanged$ = this.currentThemeSubject.asObservable();
  public themeConfig$ = this.themeConfigSubject.asObservable();

  private readonly themeConfigs: { [key in Theme]: ThemeConfig } = {
    light: {
      name: 'Light',
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
      shadow: 'rgba(0, 0, 0, 0.1)',
      error: '#f44336',
      warning: '#ff9800',
      success: '#4caf50',
      info: '#2196f3'
    },
    dark: {
      name: 'Dark',
      primary: '#90caf9',
      secondary: '#f48fb1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#333333',
      shadow: 'rgba(0, 0, 0, 0.3)',
      error: '#f44336',
      warning: '#ff9800',
      success: '#4caf50',
      info: '#2196f3'
    }
  };

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from storage
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);
  }

  /**
   * Get saved theme from storage
   */
  private getSavedTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || sessionStorage.getItem(this.THEME_KEY);
    return (savedTheme as Theme) || this.DEFAULT_THEME;
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.themeConfigSubject.next(this.themeConfigs[theme]);
    
    // Apply theme to document
    this.applyThemeToDocument(theme);
    
    // Save theme to storage
    this.saveTheme(theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get current theme configuration
   */
  getCurrentThemeConfig(): ThemeConfig {
    return this.themeConfigSubject.value;
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme to document
   */
  private applyThemeToDocument(theme: Theme): void {
    const config = this.themeConfigs[theme];
    
    // Set data-theme attribute
    document.body.setAttribute('data-theme', theme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primary);
    root.style.setProperty('--secondary-color', config.secondary);
    root.style.setProperty('--background-color', config.background);
    root.style.setProperty('--surface-color', config.surface);
    root.style.setProperty('--text-color', config.text);
    root.style.setProperty('--text-secondary-color', config.textSecondary);
    root.style.setProperty('--border-color', config.border);
    root.style.setProperty('--shadow-color', config.shadow);
    root.style.setProperty('--error-color', config.error);
    root.style.setProperty('--warning-color', config.warning);
    root.style.setProperty('--success-color', config.success);
    root.style.setProperty('--info-color', config.info);
    
    // Update Material theme class
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  /**
   * Save theme to storage
   */
  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
    sessionStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Get default theme configuration
   */
  private getDefaultThemeConfig(): ThemeConfig {
    return this.themeConfigs[this.DEFAULT_THEME];
  }

  /**
   * Get theme configuration for specific theme
   */
  getThemeConfig(theme: Theme): ThemeConfig {
    return this.themeConfigs[theme];
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  /**
   * Check if current theme is light
   */
  isLightTheme(): boolean {
    return this.getCurrentTheme() === 'light';
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): { value: Theme; label: string }[] {
    return Object.entries(this.themeConfigs).map(([theme, config]) => ({
      value: theme as Theme,
      label: config.name
    }));
  }

  /**
   * Create custom theme configuration
   */
  createCustomTheme(
    name: string,
    primary: string,
    secondary: string,
    background: string,
    surface: string,
    text: string,
    textSecondary: string,
    border: string,
    shadow: string
  ): ThemeConfig {
    return {
      name,
      primary,
      secondary,
      background,
      surface,
      text,
      textSecondary,
      border,
      shadow,
      error: '#f44336',
      warning: '#ff9800',
      success: '#4caf50',
      info: '#2196f3'
    };
  }

  /**
   * Apply custom theme configuration
   */
  applyCustomTheme(config: ThemeConfig): void {
    this.themeConfigSubject.next(config);
    this.applyCustomThemeToDocument(config);
  }

  /**
   * Apply custom theme to document
   */
  private applyCustomThemeToDocument(config: ThemeConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primary);
    root.style.setProperty('--secondary-color', config.secondary);
    root.style.setProperty('--background-color', config.background);
    root.style.setProperty('--surface-color', config.surface);
    root.style.setProperty('--text-color', config.text);
    root.style.setProperty('--text-secondary-color', config.textSecondary);
    root.style.setProperty('--border-color', config.border);
    root.style.setProperty('--shadow-color', config.shadow);
    root.style.setProperty('--error-color', config.error);
    root.style.setProperty('--warning-color', config.warning);
    root.style.setProperty('--success-color', config.success);
    root.style.setProperty('--info-color', config.info);
  }

  /**
   * Reset to default theme
   */
  resetToDefaultTheme(): void {
    this.setTheme(this.DEFAULT_THEME);
  }

  /**
   * Get theme color by name
   */
  getThemeColor(colorName: keyof ThemeConfig): string {
    const config = this.getCurrentThemeConfig();
    return config[colorName];
  }

  /**
   * Subscribe to theme changes
   */
  onThemeChange(callback: (theme: Theme) => void): void {
    this.themeChanged$.subscribe(callback);
  }

  /**
   * Subscribe to theme configuration changes
   */
  onThemeConfigChange(callback: (config: ThemeConfig) => void): void {
    this.themeConfig$.subscribe(callback);
  }
}