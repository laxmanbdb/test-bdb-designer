import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DesignerService, AuthInfo, LoaderConfig } from './designer.service';

describe('DesignerService', () => {
  let service: DesignerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DesignerService]
    });

    service = TestBed.inject(DesignerService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('HTTP Methods', () => {
    it('should make GET request successfully', (done) => {
      const testData = { id: 1, name: 'Test Object' };
      const url = '/api/test';

      service.get(url).subscribe({
        next: (data) => {
          expect(data).toEqual(testData);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(`/api${url}`);
      expect(req.request.method).toBe('GET');
      req.flush(testData);
    });

    it('should make POST request successfully', (done) => {
      const testData = { name: 'New Object' };
      const responseData = { id: 1, name: 'New Object' };
      const url = '/api/objects';

      service.post(url, testData).subscribe({
        next: (data) => {
          expect(data).toEqual(responseData);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(`/api${url}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testData);
      req.flush(responseData);
    });

    it('should make PUT request successfully', (done) => {
      const testData = { id: 1, name: 'Updated Object' };
      const url = '/api/objects/1';

      service.put(url, testData).subscribe({
        next: (data) => {
          expect(data).toEqual(testData);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(`/api${url}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testData);
      req.flush(testData);
    });

    it('should make DELETE request successfully', (done) => {
      const url = '/api/objects/1';

      service.delete(url).subscribe({
        next: (data) => {
          expect(data).toBeNull();
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(`/api${url}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle HTTP errors', (done) => {
      const url = '/api/error';

      service.get(url).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Server error');
          done();
        }
      });

      const req = httpMock.expectOne(`/api${url}`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getJsonFileData', () => {
    it('should get JSON file data successfully', (done) => {
      const testData = { config: { theme: 'dark' } };
      const dataFile = '/assets/config.json';

      service.getJsonFileData(dataFile).subscribe({
        next: (data) => {
          expect(data).toEqual(testData);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(dataFile);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Cache-Control')).toBe('max-age=3600');
      req.flush(testData);
    });

    it('should handle timeout for JSON file data', (done) => {
      const dataFile = '/assets/slow.json';

      service.getJsonFileData(dataFile).subscribe({
        next: () => done.fail('Should have timed out'),
        error: (error) => {
          expect(error.message).toContain('timeout');
          done();
        }
      });

      const req = httpMock.expectOne(dataFile);
      // Don't flush the request to simulate timeout
    });
  });

  describe('getAuthInfo', () => {
    it('should return default auth info when localStorage is empty', () => {
      const authInfo = service.getAuthInfo();

      expect(authInfo).toEqual({
        authType: 'token',
        token: '',
        spacekey: '',
        userID: '',
        preferenceObject: '',
        rootFolders: [],
        user: {},
        lite: false
      });
    });

    it('should return auth info from localStorage', () => {
      const mockUser = { id: '123', name: 'Test User' };
      const mockAuthInfo = {
        authToken: 'test-token',
        spaceKey: 'test-space',
        userID: '123',
        themeID: 'dark',
        user: mockUser,
        lite: false
      };

      localStorage.setItem('authToken', mockAuthInfo.authToken);
      localStorage.setItem('spaceKey', mockAuthInfo.spaceKey);
      localStorage.setItem('userID', mockAuthInfo.userID);
      localStorage.setItem('themeID', mockAuthInfo.themeID);
      localStorage.setItem('user', JSON.stringify(mockAuthInfo.user));

      const authInfo = service.getAuthInfo();

      expect(authInfo.token).toBe(mockAuthInfo.authToken);
      expect(authInfo.spacekey).toBe(mockAuthInfo.spaceKey);
      expect(authInfo.userID).toBe(mockAuthInfo.userID);
      expect(authInfo.preferenceObject).toBe(mockAuthInfo.themeID);
      expect(authInfo.user).toEqual(mockAuthInfo.user);
      expect(authInfo.lite).toBe(mockAuthInfo.lite);
    });
  });

  describe('Loader Methods', () => {
    beforeEach(() => {
      // Clear any existing loaders
      const existingLoader = document.getElementById('angular-loader');
      if (existingLoader) {
        existingLoader.remove();
      }
    });

    it('should show loader with default configuration', () => {
      service.showLoader();

      const loader = document.getElementById('angular-loader');
      expect(loader).toBeTruthy();
      expect(loader?.querySelector('.loader-text')?.textContent).toBe('Loading...');
    });

    it('should show loader with custom configuration', () => {
      const config: LoaderConfig = {
        message: 'Custom loading message',
        timeout: 5000
      };

      service.showLoader(config);

      const loader = document.getElementById('angular-loader');
      expect(loader).toBeTruthy();
      expect(loader?.querySelector('.loader-text')?.textContent).toBe('Custom loading message');
    });

    it('should hide loader', () => {
      service.showLoader();
      service.hideLoader();

      const loader = document.getElementById('angular-loader');
      expect(loader).toBeNull();
    });

    it('should auto-hide loader after timeout', (done) => {
      const config: LoaderConfig = { timeout: 100 };
      
      service.showLoader(config);

      setTimeout(() => {
        const loader = document.getElementById('angular-loader');
        expect(loader).toBeNull();
        done();
      }, 150);
    });
  });

  describe('Notification Methods', () => {
    beforeEach(() => {
      // Clear any existing notifications
      const notifications = document.querySelectorAll('.notification');
      notifications.forEach(notification => notification.remove());
    });

    it('should show success notification', () => {
      service.showNotification('Success message', 'success');

      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
      expect(notification?.textContent).toBe('Success message');
      expect(notification?.classList.contains('notification-success')).toBe(true);
    });

    it('should show error notification', () => {
      service.showNotification('Error message', 'error');

      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
      expect(notification?.textContent).toBe('Error message');
      expect(notification?.classList.contains('notification-error')).toBe(true);
    });

    it('should show default info notification', () => {
      service.showNotification('Info message');

      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
      expect(notification?.textContent).toBe('Info message');
      expect(notification?.classList.contains('notification-info')).toBe(true);
    });

    it('should auto-remove notification after 3 seconds', (done) => {
      service.showNotification('Test message');

      setTimeout(() => {
        const notification = document.querySelector('.notification');
        expect(notification).toBeNull();
        done();
      }, 3100);
    });

    it('should close all notifications', () => {
      service.showNotification('Notification 1');
      service.showNotification('Notification 2');
      service.closeAllNotifications();

      const notifications = document.querySelectorAll('.notification');
      expect(notifications.length).toBe(0);
    });
  });

  describe('Current Messages', () => {
    it('should set and get current messages', () => {
      const messages = { key1: 'value1', key2: 'value2' };
      
      service.setCurrentMessages(messages);
      const retrievedMessages = service.getCurrentMessages();
      
      expect(retrievedMessages).toEqual(messages);
    });

    it('should return empty object when no messages set', () => {
      const messages = service.getCurrentMessages();
      expect(messages).toEqual({});
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', (done) => {
      const url = '/api/network-error';

      service.get(url).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Server error');
          done();
        }
      });

      const req = httpMock.expectOne(`/api${url}`);
      req.error(new ErrorEvent('Network error', { message: 'Network error' }));
    });

    it('should handle server errors', (done) => {
      const url = '/api/server-error';

      service.get(url).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Server error');
          done();
        }
      });

      const req = httpMock.expectOne(`/api${url}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});