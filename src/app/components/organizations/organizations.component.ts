import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  organizations: any[] = [];
  loading = false;
  error = '';

  newOrg = { name: '', email: '', type: 'client' };

  ngOnInit(): void {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    this.loading = true;
    this.http.get<any[]>('/api/organizations').subscribe({
      next: data => this.organizations = data,
      error: err => this.error = 'Failed to load organizations.',
      complete: () => this.loading = false
    });
  }

  createOrg() {
    if (!this.newOrg.name || !this.newOrg.email) return;

    if (this.auth.isPartner()) this.newOrg.type = 'client';
    if (!this.auth.isSuperadmin() && !this.auth.isPartner()) return;

    this.http.post('/api/organizations', this.newOrg).subscribe({
      next: () => {
        this.newOrg = { name: '', email: '', type: 'client' };
        this.fetchOrganizations();
      },
      error: () => alert('Error creating organization')
    });
  }

  get visibleOrganizations() {
    if (this.auth.isSuperadmin()) return this.organizations;
    return this.organizations.filter(o => o.id === this.auth.getOrgId());
  }

  get canCreateOrg() {
    return this.auth.isSuperadmin() || this.auth.isPartner();
  }

  get isRestricted() {
    return this.auth.isClient();
  }
}