import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { MissionService } from '../../../services/mission/mission.service';
import { Subscription } from 'rxjs';
import { VoitureService } from '../../../services/voiture/voiture.service';
import { Voiture } from '../../../models/voiture/voiture.model';
import { FuelCostByVehiculeResponse, VehiculeActivityResponse } from '../../../models/dashboard/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  fuelCosts: FuelCostByVehiculeResponse[] = [];
  mostActiveVehicules: VehiculeActivityResponse[] = [];
  voitures: Voiture[] = [];
  limit = 5;
  loading = false;
  error = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private voitureService: VoitureService,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    // Reload dashboard when missions change
    this.subscriptions.add(
      this.missionService.missionsChanged$.subscribe(() => {
        this.loadDashboardData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadVoitures(): void {
    this.dashboardService && null; // noop to keep linter calm if unused
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

    // Load voitures to map images if available
    this.voitureService.getAll().subscribe({
      next: (data) => {
        this.voitures = data;
      },
      error: (err) => {
        console.error('Error loading voitures for dashboard images:', err);
      }
    });
  }

  imageSrc(data?: string): string {
    const fallback = 'assets/images/download.png';
    if (!data) return fallback;
    if (data.startsWith('data:')) return data;
    if (/^[A-Za-z0-9+/=\r\n]+$/.test(data)) {
      return `data:image/png;base64,${data}`;
    }
    return data;
  }

  getVehicleImage(item: VehiculeActivityResponse): string {
    const id = Number(item.vehiculeId ?? item.vehiculeId);
    let v = this.voitures.find((x) => x.id === id);
    if (!v && item.immatriculation) {
      v = this.voitures.find((x) => x.immatriculation === item.immatriculation);
    }
    return v ? this.imageSrc(v.imageData) : 'assets/images/download.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src) {
      img.src = 'assets/images/download.png';
      img.onerror = null;
    }
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
