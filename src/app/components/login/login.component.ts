import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private http: HttpClient, private router: Router, private toast: ToastrService) {}

  login() {
    if (!this.email || !this.password) return;

    this.http.post<any>('/api/auth/login', { email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('jwt', res.token);
        localStorage.setItem('tokenExpiry', (Date.now() + res.expiresIn * 1000).toString());

        this.http.get<any>('/api/auth/me').subscribe(profile => {
          this.auth.setOrgId(profile.orgId);
          this.auth.setRole(profile.role);
          this.toast.success('Login successful!');
          this.router.navigate(['/']);
        });
      },
      error: () => alert('Invalid login. Please try again.')
    });
  }
}