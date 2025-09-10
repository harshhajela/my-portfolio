import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUp, Heart, Github, Linkedin, Twitter, Mail } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { PortfolioData, SocialLink } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  personalInfo = (portfolioData as PortfolioData).personal;
  navigationItems = (portfolioData as PortfolioData).navigation;
  socialLinks = this.personalInfo.social;
  currentYear = new Date().getFullYear();

  // Lucide Icons
  arrowUpIcon = ArrowUp;
  heartIcon = Heart;
  githubIcon = Github;
  linkedinIcon = Linkedin;
  twitterIcon = Twitter;
  mailIcon = Mail;

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {}

  scrollToSection(href: string): void {
    const sectionId = href.replace('#', '');
    this.scrollService.scrollToSection(sectionId);
  }

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }

  getSocialIcon(iconName: string) {
    const iconMap: { [key: string]: any } = {
      'github': this.githubIcon,
      'linkedin': this.linkedinIcon,
      'twitter': this.twitterIcon,
      'mail': this.mailIcon
    };
    
    return iconMap[iconName] || this.mailIcon;
  }

  trackBySocial(index: number, social: SocialLink): string {
    return social.platform;
  }
}