import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'portfolio-theme';
  private theme = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.theme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
      
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  private initializeTheme(): void {
    if (typeof document !== 'undefined') {
      const currentTheme = this.theme.value;
      this.applyTheme(currentTheme);
      
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            const newTheme = e.matches ? 'dark' : 'light';
            this.setTheme(newTheme);
          }
        });
      }
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const color = theme === 'dark' ? '#18181b' : '#fafafa';
        metaThemeColor.setAttribute('content', color);
      }
    }
  }

  setTheme(theme: Theme): void {
    this.theme.next(theme);
    this.applyTheme(theme);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  toggleTheme(): void {
    const newTheme = this.theme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.theme.value;
  }

  isDarkMode(): boolean {
    return this.theme.value === 'dark';
  }

  isLightMode(): boolean {
    return this.theme.value === 'light';
  }

  watchSystemTheme(): Observable<boolean> {
    return new Observable(observer => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handler = (e: MediaQueryListEvent) => {
          observer.next(e.matches);
        };
        
        mediaQuery.addEventListener('change', handler);
        observer.next(mediaQuery.matches);
        
        return () => {
          mediaQuery.removeEventListener('change', handler);
        };
      } else {
        observer.next(false);
        return () => {};
      }
    });
  }
}