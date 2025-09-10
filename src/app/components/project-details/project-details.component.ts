import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ExternalLink, Github, Eye, Code, Database, Server, Smartphone, Users, TrendingUp, Shield, Zap, X, Sun, Moon } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { PortfolioData, Project } from '../../interfaces/portfolio.interfaces';
import { ThemeService, Theme } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  project: Project | null = null;
  currentImageIndex = 0;
  isImageModalOpen = false;
  currentTheme: Theme = 'light';

  // Lucide Icons
  arrowLeftIcon = ArrowLeft;
  externalLinkIcon = ExternalLink;
  githubIcon = Github;
  eyeIcon = Eye;
  codeIcon = Code;
  databaseIcon = Database;
  serverIcon = Server;
  smartphoneIcon = Smartphone;
  usersIcon = Users;
  trendingUpIcon = TrendingUp;
  shieldIcon = Shield;
  zapIcon = Zap;
  xIcon = X;
  sunIcon = Sun;
  moonIcon = Moon;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params.get('id');
        if (projectId) {
          this.loadProject(projectId);
        }
      });
    
    // Initialize theme
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(id: string): void {
    const projects = (portfolioData as PortfolioData).projects;
    this.project = projects.find(p => p.id === id) || null;
  }

  goBack(): void {
    this.router.navigate(['/']).then(() => {
      // Wait a bit for the navigation to complete, then scroll to projects section
      setTimeout(() => {
        this.scrollService.scrollToSection('projects');
      }, 100);
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openImageModal(index: number): void {
    this.currentImageIndex = index;
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  nextImage(): void {
    if (this.project) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.project.images.length;
    }
  }

  previousImage(): void {
    if (this.project) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.project.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  getIconForTechnology(tech: string): any {
    const techMap: { [key: string]: any } = {
      'Java': this.codeIcon,
      'Spring Boot': this.serverIcon,
      'Angular': this.codeIcon,
      'AWS': this.serverIcon,
      'PostgreSQL': this.databaseIcon,
      'Redis': this.databaseIcon,
      'Kafka': this.serverIcon,
      'Docker': this.serverIcon
    };
    return techMap[tech] || this.codeIcon;
  }
}