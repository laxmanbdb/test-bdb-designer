import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lite?: boolean;
  permissions?: string[];
}

export interface AuthInfo {
  authType: string;
  token: string;
  spacekey: string;
  userID: string;
  preferenceObject: string;
  rootFolders: any[];
  user: User;
  preferenceID?: string;
  lite: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = '/api/auth';
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userInfo';
  private readonly AUTH_INFO_KEY = 'bvz_authInfo';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private authInfoSubject = new BehaviorSubject<AuthInfo | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public authInfo$ = this.authInfoSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getUser();
    const authInfo = this.getAuthInfo();

    if (token && user) {
      this.currentUserSubject.next(user);
      this.authInfoSubject.next(authInfo);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setToken(response.token);
            this.setUser(response.user);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
            
            // Create auth info
            const authInfo: AuthInfo = {
              authType: 'token',
              token: response.token,
              spacekey: '',
              userID: response.user.id,
              preferenceObject: '',
              rootFolders: [],
              user: response.user,
              lite: response.user.lite || false
            };
            
            this.setAuthInfo(authInfo);
            this.authInfoSubject.next(authInfo);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const token = this.getToken();
    
    if (token) {
      return this.http.post(`${this.API_BASE_URL}/logout`, { token })
        .pipe(
          tap(() => {
            this.clearAuthInfo();
          }),
          catchError(error => {
            // Even if logout fails, clear local auth info
            this.clearAuthInfo();
            return throwError(() => error);
          })
        );
    } else {
      this.clearAuthInfo();
      return new Observable(observer => {
        observer.next({ success: true });
        observer.complete();
      });
    }
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<any> {
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.post(`${this.API_BASE_URL}/refresh`, { token })
      .pipe(
        tap((response: any) => {
          if (response.newToken) {
            this.setToken(response.newToken);
            
            // Update auth info with new token
            const authInfo = this.getAuthInfo();
            if (authInfo) {
              authInfo.token = response.newToken;
              this.setAuthInfo(authInfo);
              this.authInfoSubject.next(authInfo);
            }
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get authentication info
   */
  getAuthInfo(): AuthInfo | null {
    const authInfoStr = sessionStorage.getItem(this.AUTH_INFO_KEY);
    if (authInfoStr) {
      try {
        return JSON.parse(authInfoStr);
      } catch (error) {
        console.error('Failed to parse auth info:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.some(permission => permissions.includes(permission)) || false;
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.every(permission => permissions.includes(permission)) || false;
  }

  /**
   * Update user profile
   */
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/profile`, profileData)
      .pipe(
        tap(updatedUser => {
          this.setUser(updatedUser);
          this.currentUserSubject.next(updatedUser);
          
          // Update auth info
          const authInfo = this.getAuthInfo();
          if (authInfo) {
            authInfo.user = updatedUser;
            this.setAuthInfo(authInfo);
            this.authInfoSubject.next(authInfo);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/forgot-password`, { email })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user sessions
   */
  getUserSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/sessions`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/sessions/${sessionId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get token from storage
   */
  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set token in storage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get user from storage
   */
  private getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Set user in storage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Set auth info in storage
   */
  private setAuthInfo(authInfo: AuthInfo): void {
    sessionStorage.setItem(this.AUTH_INFO_KEY, JSON.stringify(authInfo));
  }

  /**
   * Clear all authentication information
   */
  clearAuthInfo(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.AUTH_INFO_KEY);
    
    this.currentUserSubject.next(null);
    this.authInfoSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpirationTime(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) return true;

    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expirationTime.getTime() - Date.now() <= fiveMinutes;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Auth service error:', error);
    
    if (error.status === 401) {
      // Unauthorized - clear auth info
      this.clearAuthInfo();
    }
    
    return throwError(() => new Error(error.message || 'Authentication error'));
  }

  /**
   * Get HTTP headers with authentication token
   */
  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Validate current session
   */
  validateSession(): Observable<boolean> {
    return this.http.get(`${this.API_BASE_URL}/validate`)
      .pipe(
        map(() => true),
        catchError(() => {
          this.clearAuthInfo();
          return throwError(() => new Error('Session validation failed'));
        })
      );
  }
}