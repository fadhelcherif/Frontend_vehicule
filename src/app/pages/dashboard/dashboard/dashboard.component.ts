import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { FuelCostByVehiculeResponse, VehiculeActivityResponse } from '../../../models/dashboard/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fuelCosts: FuelCostByVehiculeResponse[] = [];
  mostActiveVehicules: VehiculeActivityResponse[] = [];
  limit = 5;
  loading = false;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    let pendingRequests = 2;
    const complete = () => {
      pendingRequests -= 1;
      if (pendingRequests <= 0) {
        this.loading = false;
      }
    };

    this.dashboardService.getFuelCostsByVehicule().subscribe({
      next: (data) => {
        this.fuelCosts = data;
        complete();
      },
      error: (err) => {
        console.error('Error loading fuel costs:', err);
        this.error = 'Erreur lors du chargement des indicateurs dashboard';
        complete();
      }
    });

    this.dashboardService.getMostActiveVehicules(this.limit).subscribe({
      next: (data) => {
        this.mostActiveVehicules = data;
        complete();
      },
      error: (err) => {
        console.error('Error loading most active vehicules:', err);
        this.error = 'Erreur lors du chargement des indicateurs dashboard';
        complete();
      }
    });
  }

  get totalFuelCost(): number {
    return this.fuelCosts.reduce((sum, item) => sum + Number(item.coutTotalCarburant || 0), 0);
  }

  applyLimit(): void {
    const parsed = Math.trunc(Number(this.limit));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      this.error = 'La limite doit etre un nombre positif';
      return;
    }
    this.limit = parsed;
    this.loadDashboardData();
  }

  getMissionCount(item: VehiculeActivityResponse): number {
    return Number(item.totalMissions ?? item.nombreMissions ?? 0);
  }

  getTotalDistance(item: VehiculeActivityResponse): number {
    return Number(item.distanceTotale ?? item.totalDistance ?? 0);
  }
}
