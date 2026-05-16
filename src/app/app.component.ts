import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
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
  imports: [RouterOutlet, CommonModule, RouterLink],
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
