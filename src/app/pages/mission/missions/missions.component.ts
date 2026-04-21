import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../services/mission/mission.service';
import { VoitureService } from '../../../services/voiture/voiture.service';
import { ChauffeurService } from '../../../services/chauffeur/chauffeur.service';
import { Mission, MissionRequest } from '../../../models/mission/mission.model';
import { Voiture } from '../../../models/voiture/voiture.model';
import { Chauffeur } from '../../../models/chauffeur/chauffeur.model';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];
  voitures: Voiture[] = [];
  chauffeurs: Chauffeur[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEditMode = false;
  selectedMission: Mission | null = null;

  formData: MissionRequest = {
    vehiculeId: 0,
    chauffeurId: 0,
    pointDepart: '',
    destination: '',
    distance: 0
  };

  constructor(
    private missionService: MissionService,
    private voitureService: VoitureService,
    private chauffeurService: ChauffeurService
  ) {}

  ngOnInit(): void {
    this.loadMissions();
    this.loadVoitures();
    this.loadChauffeurs();
  }

  loadMissions(): void {
    this.loading = true;
    this.error = '';
    this.missionService.getAll().subscribe({
      next: (data) => {
        this.missions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading missions:', err);
        this.error = 'Erreur lors du chargement des missions';
        this.loading = false;
      }
    });
  }

  loadVoitures(): void {
    this.voitureService.getAll().subscribe({
      next: (data) => {
        this.voitures = data;
      },
      error: (err) => {
        console.error('Error loading voitures:', err);
        this.error = 'Erreur lors du chargement des vehicules';
      }
    });
  }

  loadChauffeurs(): void {
    this.chauffeurService.getAll().subscribe({
      next: (data) => {
        this.chauffeurs = data;
      },
      error: (err) => {
        console.error('Error loading chauffeurs:', err);
        this.error = 'Erreur lors du chargement des chauffeurs';
      }
    });
  }

  openModal(mission?: Mission): void {
    this.showModal = true;
    this.error = '';

    if (mission) {
      this.isEditMode = true;
      this.selectedMission = mission;
      this.formData = {
        vehiculeId: mission.vehiculeId,
        chauffeurId: mission.chauffeurId,
        pointDepart: mission.pointDepart,
        destination: mission.destination,
        distance: mission.distance
      };
    } else {
      this.isEditMode = false;
      this.selectedMission = null;
      this.resetForm();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      vehiculeId: 0,
      chauffeurId: 0,
      pointDepart: '',
      destination: '',
      distance: 0
    };
    this.error = '';
  }

  saveMission(): void {
    if (!this.formData.vehiculeId || !this.formData.chauffeurId || !this.formData.pointDepart || !this.formData.destination) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const distance = Number(this.formData.distance);
    if (!Number.isFinite(distance) || distance <= 0) {
      this.error = 'La distance doit etre un nombre positif';
      return;
    }

    const requestData: MissionRequest = {
      vehiculeId: Number(this.formData.vehiculeId),
      chauffeurId: Number(this.formData.chauffeurId),
      pointDepart: this.formData.pointDepart.trim(),
      destination: this.formData.destination.trim(),
      distance
    };

    this.loading = true;

    const handleSuccess = () => {
      this.loadMissions();
      this.closeModal();
      this.loading = false;
    };

    const handleError = (err: any) => {
      console.error('Error saving mission:', err);
      this.error = this.isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation';
      this.loading = false;
    };

    if (this.isEditMode && this.selectedMission) {
      this.missionService.update(this.selectedMission.id, requestData).subscribe({
        next: handleSuccess,
        error: handleError
      });
      return;
    }

    this.missionService.create(requestData).subscribe({
      next: handleSuccess,
      error: handleError
    });
  }

  deleteMission(id: number): void {
    if (confirm('Etes-vous sur de vouloir supprimer cette mission ?')) {
      this.loading = true;
      this.missionService.delete(id).subscribe({
        next: () => {
          this.loadMissions();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting mission:', err);
          this.error = 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
  }
}
