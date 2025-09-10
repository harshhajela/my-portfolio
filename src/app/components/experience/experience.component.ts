import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Calendar, ExternalLink, ChevronRight, X } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, Experience } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  @ViewChild('experienceSection') experienceSection!: ElementRef<HTMLElement>;

  experiences: Experience[] = (portfolioData as PortfolioData).experience;
  selectedExperience: Experience | null = null;

  // Lucide Icons
  mapPinIcon = MapPin;
  calendarIcon = Calendar;
  externalLinkIcon = ExternalLink;
  chevronRightIcon = ChevronRight;
  closeIcon = X;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.experienceSection) {
      this.scrollService.observeSection(this.experienceSection.nativeElement);
    }
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  formatDateRange(startDate: string, endDate: string | null): string {
    const start = new Date(startDate + '-01');
    const startFormatted = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    if (!endDate) {
      return `${startFormatted} - Present`;
    }

    const end = new Date(endDate + '-01');
    const endFormatted = end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    return `${startFormatted} - ${endFormatted}`;
  }

  calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate + '-01');
    const end = endDate ? new Date(endDate + '-01') : new Date();

    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
    }

    const years = Math.floor(diffInMonths / 12);
    const remainingMonths = diffInMonths % 12;

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }

    return `${years}y ${remainingMonths}m`;
  }

  openExperienceModal(experience: Experience): void {
    this.selectedExperience = experience;
    document.body.style.overflow = 'hidden';
  }

  closeExperienceModal(): void {
    this.selectedExperience = null;
    document.body.style.overflow = 'unset';
  }

  trackByExperience(index: number, experience: Experience): string {
    return experience.id;
  }
}