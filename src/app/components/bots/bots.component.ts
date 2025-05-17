import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bot } from '../../models/bot';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-bots',
  imports: [
    BrowserModule,
    FormsModule
  ],
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.css']
})
export class BotsComponent implements OnInit {
  bots: Bot[] = [];
  botForm: Partial<Bot> = this.resetForm();
  editingBot: Bot | null = null;
  creatingBot = false;
  newUrl = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBots();
  }

  loadBots() {
    this.http.get<Bot[]>('/api/bots').subscribe(data => {
      this.bots = data;
    });
  }

  startCreating() {
    this.creatingBot = true;
    this.editingBot = null;
    this.botForm = this.resetForm();
  }

  edit(bot: Bot) {
    this.creatingBot = true;
    this.editingBot = bot;
    this.botForm = { ...bot };
  }

  delete(bot: Bot) {
    if (confirm(`Delete bot: ${bot.name}?`)) {
      this.http.delete(`/api/bots/${bot.id}`).subscribe(() => {
        this.loadBots();
      });
    }
  }

  saveBot() {
    const payload = { ...this.botForm };
    if (this.editingBot) {
      this.http.put(`/api/bots/${this.editingBot.id}`, payload).subscribe(() => {
        this.creatingBot = false;
        this.loadBots();
      });
    } else {
      this.http.post('/api/bots', payload).subscribe(() => {
        this.creatingBot = false;
        this.loadBots();
      });
    }
  }

  cancel() {
    this.creatingBot = false;
    this.editingBot = null;
  }

  handleFileUpload(event: any) {
    const files = Array.from(event.target.files as File[]).map((file: File) => file.name);
    this.botForm.documentFiles = files;
  }

  addUrl() {
    if (!this.botForm.websiteUrls) this.botForm.websiteUrls = [];
    if (this.newUrl.trim()) {
      this.botForm.websiteUrls.push(this.newUrl.trim());
      this.newUrl = '';
    }
  }

  private resetForm(): Partial<Bot> {
    return {
      name: '',
      description: '',
      knowledgeSourceType: 'documents',
      documentFiles: [],
      websiteUrls: [],
      primaryColor: '#226cf4',
      backgroundColor: '#ffffff',
      fontFamily: 'DM Sans',
      widgetPosition: 'bottom-right',
      avatarUrl: '',
      welcomeMessage: 'Hi! How can I help you?'
    };
  }
}