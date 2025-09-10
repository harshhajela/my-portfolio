import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, X, Sun, Moon, ExternalLink } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { ScrollService } from '../../services/scroll.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { PortfolioData, NavItem } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  personalInfo = (portfolioData as PortfolioData).personal;
  navigationItems: NavItem[] = (portfolioData as PortfolioData).navigation;

  activeSection = 'hero';
  currentTheme: Theme = 'light';
  isMobileMenuOpen = false;
  isScrolled = false;

  // Lucide Icons
  menuIcon = Menu;
  xIcon = X;
  sunIcon = Sun;
  moonIcon = Moon;
  externalLinkIcon = ExternalLink;

  constructor(
    private scrollService: ScrollService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.subscribeToActiveSection();
    this.subscribeToTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 10;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth >= 768) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape', [])
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private subscribeToActiveSection(): void {
    this.scrollService.activeSection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(section => {
        this.activeSection = section;
      });
  }

  private subscribeToTheme(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  scrollToSection(href: string, closeMobile: boolean = false): void {
    const sectionId = href.replace('#', '');
    this.scrollService.scrollToSection(sectionId);

    if (closeMobile) {
      this.closeMobileMenu();
    }
  }

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  getNavLinkClasses(href: string): string {
    const sectionId = href.replace('#', '');
    const baseClasses = 'nav-link-base';

    if (this.activeSection === sectionId) {
      return `${baseClasses} nav-link-active`;
    }

    return `${baseClasses} nav-link-inactive`;
  }

  getMobileNavLinkClasses(href: string): string {
    const sectionId = href.replace('#', '');
    const baseClasses = 'mobile-nav-link-base';

    if (this.activeSection === sectionId) {
      return `${baseClasses} mobile-nav-link-active`;
    }

    return `${baseClasses} mobile-nav-link-inactive`;
  }
}