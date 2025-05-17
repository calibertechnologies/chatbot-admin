import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crawl',
  standalone: true, // ✅ Required for standalone
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: 'crawl.component.html'
})
export class CrawlComponent {
  url: string = '';
  tenantId: string = 'abc123';
  crawling = false;

  constructor(private http: HttpClient) {}

  crawl() {
    if (!this.url) return;
    this.crawling = true;

    this.http.post(`/api/chatbot/crawl/${this.tenantId}`, { url: this.url }).subscribe({
      next: () => alert('Crawling & Embedding completed.'),
      error: () => alert('Crawling failed.'),
      complete: () => this.crawling = false
    });
  }
}