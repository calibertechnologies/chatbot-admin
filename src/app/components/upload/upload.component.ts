import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html'
})
export class UploadComponent {
  file!: File;
  tenantId: string = 'abc123';
  uploading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('file', this.file);
    this.uploading = true;

    this.http.post(`/api/chatbot/upload/${this.tenantId}`, formData).subscribe({
      next: () => alert('Upload successful.'),
      error: () => alert('Upload failed.'),
      complete: () => this.uploading = false
    });
  }
}