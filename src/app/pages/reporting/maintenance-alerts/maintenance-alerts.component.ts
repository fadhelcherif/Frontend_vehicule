import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoitureService } from '../../../services/voiture/voiture.service';
import { MaintenanceAlert } from '../../../models/voiture/voiture.model';

@Component({
  selector: 'app-maintenance-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-alerts.component.html',
  styleUrls: ['./maintenance-alerts.component.css']
})
export class MaintenanceAlertsComponent implements OnInit {
  alerts: MaintenanceAlert[] = [];
  loading = false;
  error?: string;
  threshold?: number;

  constructor(private voitureService: VoitureService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    this.error = undefined;
    this.voitureService.getMaintenanceAlerts(this.threshold)
      .subscribe({
        next: (data: MaintenanceAlert[]) => { this.alerts = data; this.loading = false; },
        error: (_err: any) => { this.error = 'Impossible de charger les alertes'; this.loading = false; }
      });
  }

  clearThreshold(): void {
    this.threshold = undefined;
    this.loadAlerts();
  }

  getSeuil(a: MaintenanceAlert): number | null {
    // backend may return `seuilKm` or legacy `seuil`
    // ensure we return a number or null
    const anyA = a as any;
    const v = anyA.seuilKm ?? anyA.seuil ?? null;
    return v == null ? null : Number(v);
  }

  getDepassement(a: MaintenanceAlert): number | null {
    const anyA = a as any;
    const v = anyA.depassementKm ?? anyA.km_depassement ?? null;
    return v == null ? null : Number(v);
  }
}
