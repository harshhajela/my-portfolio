import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private activeSection = new BehaviorSubject<string>('hero');
  public activeSection$ = this.activeSection.asObservable();
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initScrollObserver();
  }

  private initScrollObserver(): void {
    if (typeof window !== 'undefined') {
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.3
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            this.activeSection.next(sectionId);
          }
        });
      }, options);
    }
  }

  observeSection(element: Element): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  unobserveSection(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  scrollToSection(sectionId: string, offset: number = 80): void {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.offsetTop - offset;
        
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          window.scrollTo(0, elementPosition);
        } else {
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  getCurrentScrollPosition(): number {
    if (typeof window !== 'undefined') {
      return window.pageYOffset || document.documentElement.scrollTop;
    }
    return 0;
  }

  isElementInView(elementId: string, threshold: number = 0.1): boolean {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(elementId);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      return rect.top < windowHeight * (1 - threshold) && rect.bottom > windowHeight * threshold;
    }
    return false;
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}