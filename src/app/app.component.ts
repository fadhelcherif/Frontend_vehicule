import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  enabled: boolean;
  profileIMG?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'finlink_frontend';
  isLoginPage = false;
  currentUser: User | null = null;

  constructor(private router: Router) {}

  ngOnInit() {


  }

}
