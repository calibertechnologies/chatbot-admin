import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

interface Bot {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userFullName = 'John Doe';
  totalMessages = 0;
  aiMessages = 0;

  bots: Bot[] = [];
  filteredBots: Bot[] = [];
  searchTerm: string = '';
  sortKey: keyof Bot = 'createdAt';
  sortAsc: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
  this.http.get<any>('/api/home/summary').subscribe({
    next: (summary) => {
      this.totalMessages = summary.totalMessages;
      this.aiMessages = summary.aiMessages;
    },
    error: (err) => {
      console.error('Summary load error:', err);
    }
  });

  this.http.get<Bot[]>('/api/bots').subscribe({
    next: (data) => {
      this.bots = data;
      this.applyFilters();
    },
    error: (err) => {
      console.error('Bot list load error:', err);
    }
  });
}

  applyFilters() {
    let result = [...this.bots];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(bot => bot.name.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];
      return (valA < valB ? -1 : valA > valB ? 1 : 0) * (this.sortAsc ? 1 : -1);
    });

    this.filteredBots = result;
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  toggleSort(key: keyof Bot) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  editBot(bot: Bot) {
    console.log('Edit bot:', bot.name);
    // Navigate to edit screen or open modal
  }

  deleteBot(bot: Bot) {
    console.log('Delete bot:', bot.name);
    // Confirm deletion and call API
  }
}
