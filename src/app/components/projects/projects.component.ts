import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ExternalLink, Github, Eye, X, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, Project, BlogPost } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @ViewChild('projectsSection') projectsSection!: ElementRef<HTMLElement>;

  projects: Project[] = (portfolioData as PortfolioData).projects;
  blogPosts: BlogPost[] = (portfolioData as PortfolioData).blog;
  selectedProject: Project | null = null;

  // Lucide Icons
  externalLinkIcon = ExternalLink;
  githubIcon = Github;
  eyeIcon = Eye;
  xIcon = X;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.projectsSection) {
      this.scrollService.observeSection(this.projectsSection.nativeElement);
    }
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  getStatusBadgeClasses(status: string): string {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-accent-500 text-white`;
      case 'in-progress':
        return `${baseClasses} bg-primary-500 text-white`;
      case 'planned':
        return `${baseClasses} bg-neutral-500 text-white`;
      default:
        return `${baseClasses} bg-neutral-500 text-white`;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  }

  openProjectDetails(project: Project): void {
    this.router.navigate(['/project', project.id]);
  }

  // Keep these methods for backward compatibility with existing modal code
  openModal(project: Project): void {
    // Navigate to project details page instead of opening modal
    this.openProjectDetails(project);
  }

  closeModal(): void {
    // No longer needed, but keeping for backward compatibility
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  trackByPost(index: number, post: BlogPost): string {
    return post.id;
  }
}