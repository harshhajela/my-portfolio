import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Award, MapPin, Clock, CheckCircle, ExternalLink } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, Certification } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutSection') aboutSection!: ElementRef<HTMLElement>;

  personalInfo = (portfolioData as PortfolioData).personal;
  certifications: Certification[] = (portfolioData as PortfolioData).certifications;

  // Lucide Icons
  awardIcon = Award;
  mapPinIcon = MapPin;
  clockIcon = Clock;
  checkCircleIcon = CheckCircle;
  externalLinkIcon = ExternalLink;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.aboutSection) {
      this.scrollService.observeSection(this.aboutSection.nativeElement);
    }
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  trackByCert(index: number, cert: Certification): string {
    return cert.id;
  }
}