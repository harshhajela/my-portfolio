import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Mail, MapPin, Clock, Send, Github, Linkedin, Twitter } from 'lucide-angular';
import { ScrollService } from '../../services/scroll.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioData, SocialLink, LoadingState } from '../../interfaces/portfolio.interfaces';
import portfolioData from '../../../assets/data/portfolio-data.json';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef<HTMLElement>;
  
  personalInfo = (portfolioData as PortfolioData).personal;
  socialLinks = this.personalInfo.social.filter(social => 
    ['GitHub', 'LinkedIn', 'Twitter'].includes(social.platform)
  );
  
  contactForm: FormGroup;
  formState: LoadingState = 'idle';

  // Lucide Icons
  mailIcon = Mail;
  mapPinIcon = MapPin;
  clockIcon = Clock;
  sendIcon = Send;
  githubIcon = Github;
  linkedinIcon = Linkedin;
  twitterIcon = Twitter;

  constructor(
    private fb: FormBuilder,
    private scrollService: ScrollService,
    private animationService: AnimationService
  ) {
    this.contactForm = this.createContactForm();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.contactSection) {
      this.scrollService.observeSection(this.contactSection.nativeElement);
    }
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      this.animationService.observeElement(element as HTMLElement);
    });
  }

  private createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && this.formState === 'idle') {
      this.formState = 'loading';
      
      // Simulate form submission (replace with actual implementation)
      const formData = this.contactForm.value;
      
      // For demo purposes, we'll create a mailto link
      // In production, you would send this to your backend or a service like Netlify Forms
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(`Hi,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`);
      const mailtoLink = `mailto:${this.personalInfo.contact.email}?subject=${subject}&body=${body}`;
      
      setTimeout(() => {
        window.location.href = mailtoLink;
        this.formState = 'success';
        this.contactForm.reset();
        
        setTimeout(() => {
          this.formState = 'idle';
        }, 3000);
      }, 1000);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
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