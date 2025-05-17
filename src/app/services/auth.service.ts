import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: 'superadmin' | 'partner' | 'client';
  private orgId: string;

  constructor(private http: HttpClient, private toast: ToastrService, private router: Router) {
    this.role = (localStorage.getItem('role') as any) || '';
    this.orgId = localStorage.getItem('orgId') || '';
  }

  setRole(role: 'superadmin' | 'partner' | 'client') {
    this.role = role;
    localStorage.setItem('role', role);
  }

  getRole() {
    return this.role;
  }

  setOrgId(id: string) {
    this.orgId = id;
    localStorage.setItem('orgId', id);
  }

  getOrgId() {
    return this.orgId;
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    return expiry ? Date.now() > parseInt(expiry, 10) : true;
  }

  async tryRefresh(): Promise<boolean> {
    const token = localStorage.getItem('jwt');
    try {
      const response: any = await this.http.post('/api/auth/refresh-token', { token }).toPromise();
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('tokenExpiry', (Date.now() + response.expiresIn * 1000).toString());
      return true;
    } catch {
      this.toast.warning('Session expired. Please login again.');
      this.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt') && !this.isTokenExpired();
  }

  logout() {
    this.role = '' as any;
    this.orgId = '';
    localStorage.removeItem('role');
    localStorage.removeItem('orgId');
    localStorage.removeItem('jwt');
    localStorage.removeItem('tokenExpiry');
  }

  isSuperadmin() {
    return this.role === 'superadmin';
  }

  isPartner() {
    return this.role === 'partner';
  }

  isClient() {
    return this.role === 'client';
  }
}