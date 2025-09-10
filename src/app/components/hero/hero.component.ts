import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowDown, Download, ExternalLink, Github, Linkedin, Twitter, Mail } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, SocialLink } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  
  personalInfo = (portfolioData as PortfolioData).personal;
  socialLinks = this.personalInfo.social;

  // Lucide Icons
  arrowDownIcon = ArrowDown;
  downloadIcon = Download;
  externalLinkIcon = ExternalLink;
  githubIcon = Github;
  linkedinIcon = Linkedin;
  twitterIcon = Twitter;
  mailIcon = Mail;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.heroSection) {
      this.scrollService.observeSection(this.heroSection.nativeElement);
    }
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  scrollToProjects(): void {
    this.scrollService.scrollToSection('projects');
  }

  scrollToAbout(): void {
    this.scrollService.scrollToSection('about');
  }

  getSocialIcon(iconName: string) {
    const iconMap: { [key: string]: any } = {
      'github': this.githubIcon,
      'linkedin': this.linkedinIcon,
      'twitter': this.twitterIcon,
      'mail': this.mailIcon,
      'external-link': this.externalLinkIcon
    };
    
    return iconMap[iconName] || this.externalLinkIcon;
  }

  trackBySocial(index: number, social: SocialLink): string {
    return social.platform;
  }
}