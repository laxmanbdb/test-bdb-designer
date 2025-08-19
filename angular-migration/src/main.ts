import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/hybrid-setup';

// Import AngularJS dependencies for hybrid mode
import 'angular';
import 'angular-route';
import 'angular-translate';
import 'angular-notify';

// Import legacy AngularJS modules
import './legacy/designer.module';

// Bootstrap the Angular application
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error('Error starting Angular application:', err));

// Initialize global variables for legacy compatibility
(window as any).dGlobals = {
  scriptHelpUrl: '/help/scripting',
  designerHelpUrl: '/help/designer',
  translateJSONUrl: '/assets/i18n/'
};

// Initialize brand configuration
(window as any).app_brand_cfg = {
  name: 'Dashboard Designer',
  logo: '/assets/images/logo.png',
  version: '16.0.0'
};

// Initialize header settings
(window as any).headerSettings = {
  signOuturl: 'default'
};

// Initialize BIZVIZ SDK for legacy compatibility
(window as any).BIZVIZ = {
  SDK: {
    language: {
      get: () => localStorage.getItem('selectedLanguage') || 'en-US'
    },
    secureRequest: (url: string, data: any, callback: Function) => {
      // Implementation for secure requests
      console.log('Secure request:', url, data);
      // This would be replaced with actual implementation
    }
  }
};

// Initialize jQuery for legacy compatibility
(window as any).$ = (window as any).jQuery;

// Setup global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Setup beforeunload handler
window.addEventListener('beforeunload', (event) => {
  // Check if there are unsaved changes
  const hasUnsavedChanges = localStorage.getItem('hasUnsavedChanges') === 'true';
  
  if (hasUnsavedChanges) {
    event.preventDefault();
    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    return event.returnValue;
  }
});

// Setup visibility change handler
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - save state
    console.log('Page hidden - saving state');
  } else {
    // Page is visible - restore state
    console.log('Page visible - restoring state');
  }
});

// Setup keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Ctrl+S: Save
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    console.log('Save triggered');
  }
  
  // Ctrl+Z: Undo
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    console.log('Undo triggered');
  }
  
  // Ctrl+Y: Redo
  if (event.ctrlKey && event.key === 'y') {
    event.preventDefault();
    console.log('Redo triggered');
  }
  
  // F1: Help
  if (event.key === 'F1') {
    event.preventDefault();
    console.log('Help triggered');
  }
});

// Setup resize handler
window.addEventListener('resize', () => {
  // Handle window resize
  console.log('Window resized');
});

// Setup focus/blur handlers
window.addEventListener('focus', () => {
  console.log('Window focused');
});

window.addEventListener('blur', () => {
  console.log('Window blurred');
});

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard Designer Angular 16 application initialized');
  
  // Set up any additional initialization here
  initializeLegacyCompatibility();
});

/**
 * Initialize legacy compatibility features
 */
function initializeLegacyCompatibility(): void {
  // Setup legacy modal functionality
  (window as any).showModal = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('show');
    }
  };
  
  (window as any).hideModal = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove('show');
    }
  };
  
  // Setup legacy notification functionality
  (window as any).showNotification = (message: string, type: string = 'info') => {
    console.log(`Notification [${type}]: ${message}`);
  };
  
  // Setup legacy loader functionality
  (window as any).showLoader = (message: string = 'Loading...') => {
    console.log(`Loader: ${message}`);
  };
  
  (window as any).hideLoader = () => {
    console.log('Loader hidden');
  };
  
  // Setup legacy AJAX functionality
  (window as any).ajaxRequest = (url: string, options: any) => {
    return fetch(url, options)
      .then(response => response.json())
      .catch(error => {
        console.error('AJAX request failed:', error);
        throw error;
      });
  };
}