import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kb-manager',
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: 'kb-manager.component.html',
  standalone: true
})
export class KbManagerComponent implements OnInit {
  tenantId = 'abc123';
  items: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadChunks();
  }

  loadChunks() {
    this.loading = true;
    this.http.get(`/api/chatbot/kb/${this.tenantId}`).subscribe(data => {
      this.items = data as any[];
      this.loading = false;
    });
  }

  delete(id: string) {
    if (!confirm('Delete this item?')) return;
    this.http.delete(`/api/chatbot/kb/${id}`).subscribe(() => this.loadChunks());
  }

  reprocess(item: any) {
    this.http.post(`/api/chatbot/reembed/${item.id}`, {}).subscribe(() => alert('Reprocessed.'));
  }

    searchTerm: string = '';
    groupBy: 'source' | 'none' = 'none';

    exportChunks() {
    const filtered = this.items.filter(item =>
        item.text.toLowerCase().includes(this.searchTerm.toLowerCase()));
    const csv = filtered.map(i => `"${i.text.replace(/"/g, '""')}","${i.sourceFile}"`).join('\n');
    const blob = new Blob([`"Text","SourceFile"\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'knowledge_chunks.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    }

    get groupedItems(): { key: string; values: any[] }[] {
        if (this.groupBy === 'source') {
            const grouped: { [key: string]: any[] } = {};
            for (const item of this.items) {
            const key = item.sourceFile || 'Unknown';
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
            }
            return Object.entries(grouped).map(([key, values]) => ({ key, values }));
        } else {
            return [{ key: 'All', values: this.items }];
        }
    }

    searchResults: any[] = [];
    isSearching = false;

    semanticSearch() {
    if (!this.searchTerm) return;
    this.isSearching = true;
    this.http.post(`/api/chatbot/kb/search/${this.tenantId}`, {
        query: this.searchTerm,
        top: 5
    }).subscribe({
        next: (res: any) => this.searchResults = res,
        complete: () => this.isSearching = false
    });
    }

    clearSearch() {
    this.searchResults = [];
    this.searchTerm = '';
    }
}

