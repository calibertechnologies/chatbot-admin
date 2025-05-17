import { Component, OnInit } from '@angular/core';
import { ChatbotSettings } from '../../models/chatbot-settings.model';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-settings',
  standalone: true, // ✅ Required for standalone
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: 'settings.component.html'
})
export class SettingsComponent implements OnInit {
  settings: ChatbotSettings = {
    tenantId: '', chatbotName: '', avatarUrl: '', primaryColor: '#1a73e8', welcomeMessage: '', enableWebsiteWidget: true
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const tenantId = 'abc123'; // load from route or login session
    this.http.get<ChatbotSettings>(`/api/chatbot/config/${tenantId}`).subscribe(data => this.settings = data);
  }

  save() {
    this.http.post(`/api/chatbot/config`, this.settings).subscribe(() => alert('Saved!'));
  }
}