import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Database, Cloud, Settings, Users, Target } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, SkillCategory, Skill } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, AfterViewInit {
  @ViewChild('skillsSection') skillsSection!: ElementRef<HTMLElement>;
  
  skillCategories: SkillCategory[] = (portfolioData as PortfolioData).skills;

  // Lucide Icons
  codeIcon = Code;
  databaseIcon = Database;
  cloudIcon = Cloud;
  settingsIcon = Settings;
  usersIcon = Users;
  targetIcon = Target;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.skillsSection) {
      this.scrollService.observeSection(this.skillsSection.nativeElement);
    }
    this.initializeAnimations();
    this.animateProgressBars();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  private animateProgressBars(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.skill-progress[data-target-width]');
          const glowBars = entry.target.querySelectorAll('.skill-glow[data-target-width]');
          
          progressBars.forEach((bar: Element) => {
            const htmlBar = bar as HTMLElement;
            const targetWidth = htmlBar.getAttribute('data-target-width');
            if (targetWidth) {
              htmlBar.style.setProperty('--target-width', targetWidth);
              htmlBar.style.width = targetWidth;
            }
          });
          
          glowBars.forEach((bar: Element) => {
            const htmlBar = bar as HTMLElement;
            const targetWidth = htmlBar.getAttribute('data-target-width');
            if (targetWidth) {
              htmlBar.style.setProperty('--target-width', targetWidth);
              htmlBar.style.width = targetWidth;
            }
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const skillCards = document.querySelectorAll('.glass-card');
    skillCards.forEach(card => observer.observe(card));
  }

  getCategoryIcon(categoryName: string) {
    const iconMap: { [key: string]: any } = {
      'Languages': this.codeIcon,
      'Frameworks & Libraries': this.settingsIcon,
      'Cloud & DevOps': this.cloudIcon,
      'Data & Messaging': this.databaseIcon,
      'Architecture & Patterns': this.targetIcon,
      'Quality & Methodologies': this.usersIcon
    };
    
    return iconMap[categoryName] || this.codeIcon;
  }

  getAverageProficiency(skills: Skill[]): number {
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / skills.length);
  }

  trackByCategory(index: number, category: SkillCategory): string {
    return category.name;
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.name;
  }
}