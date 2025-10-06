import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo.component';
import {
  LeaderboardService,
  Individual,
} from '../../services/leaderboard.service';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterModule, LogoComponent, FormsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  isMenuOpen = false;
  searchQuery = '';
  searchResults: Individual[] = [];
  allIndividuals: Individual[] = [];

  private squadColors: { [key: number]: string } = {
    1: '#00AEEF',
    2: '#FF2D82',
    3: '#10b981',
    4: '#f97316',
    5: '#8b5cf6',
    6: '#eab308',
    7: '#ef4444',
    8: '#14b8a6',
    9: '#f59e0b',
    10: '#6366f1',
    11: '#ec4899',
    12: '#06b6d4',
    13: '#84cc16',
    14: '#f472b6',
    15: '#22d3ee',
    16: '#a78bfa',
    17: '#fbbf24',
    18: '#fb7185',
    19: '#34d399',
    20: '#60a5fa',
  };

  constructor(
    private router: Router,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit() {
    this.leaderboardService.getIndividuals().subscribe((individuals) => {
      this.allIndividuals = individuals;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-search')) {
      this.searchResults = [];
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.searchResults = this.allIndividuals
      .filter(
        (ind) =>
          ind.name.toLowerCase().includes(query) ||
          ind.squadName.toLowerCase().includes(query) ||
          ind.position.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }

  selectParticipant(individual: Individual) {
    this.router.navigate(['/individual'], {
      queryParams: { userId: individual.id },
    });
    this.searchQuery = '';
    this.searchResults = [];
    this.isMenuOpen = false;
  }

  getSquadColor(squadId: number): string {
    const colorKeys = Object.keys(this.squadColors).map(Number);
    const maxColorId = Math.max(...colorKeys);
    const effectiveId =
      squadId > maxColorId ? ((squadId - 1) % maxColorId) + 1 : squadId;
    return this.squadColors[effectiveId] || '#00AEEF';
  }

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
