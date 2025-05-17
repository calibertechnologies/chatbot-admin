import { Component, OnInit } from '@angular/core';
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class HomeComponent implements OnInit {
  userFullName = 'John Doe';
  totalMessages = 2350;
  aiMessages = 1784;

  bots: Bot[] = [];

  ngOnInit() {
    // Replace with API call in real app
    this.bots = [
      {
        name: 'Support Bot',
        createdAt: new Date('2024-12-01T10:00:00'),
        updatedAt: new Date('2025-04-15T15:42:00')
      },
      {
        name: 'Sales Assistant',
        createdAt: new Date('2025-01-20T14:30:00'),
        updatedAt: new Date('2025-04-21T09:17:00')
      }
    ];
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
