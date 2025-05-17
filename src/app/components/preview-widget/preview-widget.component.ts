// chatbot-admin/src/app/components/preview-widget/preview-widget.component.ts
import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-preview-widget',
  templateUrl: 'preview-widget.component.html',
  styleUrls: ['preview-widget.component.css'],
  standalone: true
})
export class PreviewWidgetComponent implements OnInit, OnChanges {
  @Input() botId: string | null = null;
  iframeUrl: string = '';

  ngOnInit(): void {
    this.setIframeUrl();
  }

  ngOnChanges(): void {
    this.setIframeUrl();
  }

  setIframeUrl(): void {
    if (this.botId) {
      this.iframeUrl = `https://yourdomain.com/chatbot-frontend?botId=${this.botId}`;
    }
  }
}
