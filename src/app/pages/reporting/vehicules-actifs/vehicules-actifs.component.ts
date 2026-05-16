import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { VehiculeActivityResponse } from '../../../models/dashboard/dashboard.model';

@Component({
  selector: 'app-vehicules-actifs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicules-actifs.component.html',
  styleUrls: ['./vehicules-actifs.component.css']
})
export class VehiculesActifsComponent implements OnInit {
  items: VehiculeActivityResponse[] = [];
  limit = 5;
  loading = false;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.dashboardService.getMostActiveVehicules(this.limit).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vehicle activity:', err);
        this.error = "Erreur lors du chargement du reporting d'activite";
        this.loading = false;
      }
    });
  }

  applyLimit(): void {
    const parsed = Math.trunc(Number(this.limit));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      this.error = 'La limite doit etre un nombre positif';
      return;
    }
    this.limit = parsed;
    this.loadData();
  }

  getImmatriculation(item: VehiculeActivityResponse): string {
    return String(item.immatriculation ?? '-');
  }

  getMissionCount(item: VehiculeActivityResponse): number {
    return Number(item.totalMissions ?? item.nombreMissions ?? 0);
  }

  getTotalDistance(item: VehiculeActivityResponse): number {
    return Number(item.distanceTotale ?? item.totalDistance ?? 0);
  }
}
