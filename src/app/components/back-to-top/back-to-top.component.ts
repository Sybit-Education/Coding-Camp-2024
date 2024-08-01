import { Component, OnInit, OnDestroy, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit, OnDestroy {

  private observer: IntersectionObserver | null = null;

  constructor(
      private viewport: ViewportScroller,
      private router: Router,
      private elRef: ElementRef,
      private renderer: Renderer2
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.hideButton();
    });
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition > 100) {
      this.showButton();
    } else {
      this.hideButton();
    }
  }

  scrollUp() {
    this.viewport.scrollToPosition([0, 0]);
  }

  private setupIntersectionObserver() {
    const footerElement = document.querySelector('footer');
    const buttonElement = this.elRef.nativeElement.querySelector('#scroll-up-button');

    if (footerElement && buttonElement) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(buttonElement, 'bottom', `${entry.boundingClientRect.height + 20}px`);
          } else {
            this.renderer.setStyle(buttonElement, 'bottom', '20px');
          }
        });
      }, { threshold: 0 });

      this.observer.observe(footerElement);
    }
  }

  private showButton() {
    const buttonElement = this.elRef.nativeElement.querySelector('#scroll-up-button');
    this.renderer.setStyle(buttonElement, 'opacity', '1');
    this.renderer.setStyle(buttonElement, 'visibility', 'visible');
  }

  private hideButton() {
    const buttonElement = this.elRef.nativeElement.querySelector('#scroll-up-button');
    this.renderer.setStyle(buttonElement, 'opacity', '0');
    this.renderer.setStyle(buttonElement, 'visibility', 'hidden');
  }
}
