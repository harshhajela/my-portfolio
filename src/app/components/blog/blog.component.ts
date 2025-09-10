import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ExternalLink, Calendar, Clock, Hash } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, BlogPost } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {
  @ViewChild('blogSection') blogSection!: ElementRef<HTMLElement>;
  
  blogPosts: BlogPost[] = (portfolioData as PortfolioData).blog;

  // Lucide Icons
  externalLinkIcon = ExternalLink;
  calendarIcon = Calendar;
  clockIcon = Clock;
  hashIcon = Hash;

  constructor(
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.blogSection) {
      this.scrollService.observeSection(this.blogSection.nativeElement);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  trackByPost(index: number, post: BlogPost): string {
    return post.id;
  }
}