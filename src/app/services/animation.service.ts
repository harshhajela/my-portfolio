import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      }, options);
    }
  }

  observeElement(element: ElementRef<HTMLElement> | HTMLElement): void {
    const el = element instanceof ElementRef ? element.nativeElement : element;
    
    if (this.observer && el) {
      el.classList.add('animate-on-scroll');
      this.observer.observe(el);
    } else if (el) {
      el.classList.add('is-visible');
    }
  }

  observeElements(elements: (ElementRef<HTMLElement> | HTMLElement)[]): void {
    elements.forEach(element => this.observeElement(element));
  }

  animateCounter(
    element: HTMLElement, 
    target: number, 
    duration: number = 2000, 
    suffix: string = ''
  ): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = target.toString() + suffix;
      return;
    }

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toString() + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString() + suffix;
      }
    };
    
    updateCounter();
  }

  animateProgressBar(element: HTMLElement, targetWidth: number, duration: number = 1500): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.width = `${targetWidth}%`;
      return;
    }

    element.style.width = '0%';
    element.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    setTimeout(() => {
      element.style.width = `${targetWidth}%`;
    }, 100);
  }

  staggeredAnimation(elements: HTMLElement[], delay: number = 100): void {
    elements.forEach((element, index) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.classList.add('is-visible');
        return;
      }

      setTimeout(() => {
        element.classList.add('is-visible');
      }, index * delay);
    });
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}