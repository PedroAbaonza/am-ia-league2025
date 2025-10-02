import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  isMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToHome() {
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  navigateToLeaderboard() {
    this.router.navigate(['/leaderboard']);
    this.isMenuOpen = false;
  }

  navigateToIndividual() {
    this.router.navigate(['/individual']);
    this.isMenuOpen = false;
  }
}
