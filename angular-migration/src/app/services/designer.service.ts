import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface AuthInfo {
  authType: string;
  token: string;
  spacekey: string;
  userID: string;
  preferenceObject: string;
  rootFolders: any[];
  user: any;
  preferenceID?: string;
  lite: boolean;
}

export interface LoaderConfig {
  timeout?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private readonly API_BASE_URL = '/api'; // Update with your actual API base URL
  private currentMessages: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  /**
   * Get JSON data from a file
   * @param dataFile - The data file path
   * @returns Observable with the data
   */
  getJsonFileData(dataFile: string): Observable<any> {
    return this.http.get(dataFile, { 
      headers: { 'Cache-Control': 'max-age=3600' } 
    }).pipe(
      timeout(30000),
      catchError(this.handleError)
    );
  }

  /**
   * Get authentication information
   * @returns AuthInfo object
   */
  getAuthInfo(): AuthInfo {
    // This would be populated from your authentication service
    return {
      authType: 'token',
      token: localStorage.getItem('authToken') || '',
      spacekey: localStorage.getItem('spaceKey') || '',
      userID: localStorage.getItem('userID') || '',
      preferenceObject: localStorage.getItem('themeID') || '',
      rootFolders: [],
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      lite: false
    };
  }

  /**
   * Show loader with configuration
   * @param config - Loader configuration
   */
  showLoader(config?: LoaderConfig): void {
    // Implementation using Angular Material or custom loader
    const loaderElement = document.createElement('div');
    loaderElement.id = 'angular-loader';
    loaderElement.innerHTML = `
      <div class="loader-overlay">
        <div class="loader-spinner">
          <div class="spinner"></div>
          <div class="loader-text">${config?.message || 'Loading...'}</div>
        </div>
      </div>
    `;
    document.body.appendChild(loaderElement);

    // Auto-hide after timeout
    if (config?.timeout) {
      setTimeout(() => this.hideLoader(), config.timeout);
    }
  }

  /**
   * Hide loader
   */
  hideLoader(): void {
    const loaderElement = document.getElementById('angular-loader');
    if (loaderElement) {
      loaderElement.remove();
    }
  }

  /**
   * Make HTTP GET request
   * @param url - Request URL
   * @param params - Query parameters
   * @returns Observable with response
   */
  get(url: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get(`${this.API_BASE_URL}${url}`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Make HTTP POST request
   * @param url - Request URL
   * @param data - Request body
   * @returns Observable with response
   */
  post(url: string, data: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}${url}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Make HTTP PUT request
   * @param url - Request URL
   * @param data - Request body
   * @returns Observable with response
   */
  put(url: string, data: any): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}${url}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Make HTTP DELETE request
   * @param url - Request URL
   * @returns Observable with response
   */
  delete(url: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}${url}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Show notification
   * @param message - Notification message
   * @param type - Notification type (success, error, warning, info)
   */
  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // Implementation using Angular Material Snackbar or custom notification
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${type}`;
    notificationElement.textContent = message;
    document.body.appendChild(notificationElement);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notificationElement.parentNode) {
        notificationElement.parentNode.removeChild(notificationElement);
      }
    }, 3000);
  }

  /**
   * Close all notifications
   */
  closeAllNotifications(): void {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }

  /**
   * Handle HTTP errors
   * @param error - Error object
   * @returns Observable that throws the error
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  /**
   * Get current messages
   * @returns Current messages object
   */
  getCurrentMessages(): { [key: string]: any } {
    return this.currentMessages;
  }

  /**
   * Set current messages
   * @param messages - Messages object
   */
  setCurrentMessages(messages: { [key: string]: any }): void {
    this.currentMessages = messages;
  }
}