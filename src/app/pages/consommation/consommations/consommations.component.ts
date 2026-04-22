import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsommationService } from '../../../services/consommation/consommation.service';
import { VoitureService } from '../../../services/voiture/voiture.service';
import { Consommation, ConsommationRequest } from '../../../models/consommation/consommation.model';
import { Voiture } from '../../../models/voiture/voiture.model';

@Component({
  selector: 'app-consommations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consommations.component.html',
  styleUrls: ['./consommations.component.css']
})
export class ConsommationsComponent implements OnInit {
  consommations: Consommation[] = [];
  voitures: Voiture[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEditMode = false;
  selectedConsommation: Consommation | null = null;

  formData: ConsommationRequest = {
    vehiculeId: 0,
    date: '',
    quantiteCarburant: 0,
    coutTotal: 0
  };

  constructor(
    private consommationService: ConsommationService,
    private voitureService: VoitureService
  ) {}

  ngOnInit(): void {
    this.loadConsommations();
    this.loadVoitures();
  }

  loadConsommations(): void {
    this.loading = true;
    this.error = '';
    this.consommationService.getAll().subscribe({
      next: (data) => {
        this.consommations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading consommations:', err);
        this.error = 'Erreur lors du chargement des consommations';
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

  openModal(consommation?: Consommation): void {
    this.showModal = true;
    this.error = '';

    if (consommation) {
      this.isEditMode = true;
      this.selectedConsommation = consommation;
      this.formData = {
        vehiculeId: consommation.vehiculeId,
        date: consommation.date,
        quantiteCarburant: consommation.quantiteCarburant,
        coutTotal: consommation.coutTotal
      };
    } else {
      this.isEditMode = false;
      this.selectedConsommation = null;
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
      date: '',
      quantiteCarburant: 0,
      coutTotal: 0
    };
    this.error = '';
  }

  saveConsommation(): void {
    if (!this.formData.vehiculeId || !this.formData.date) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const quantite = Number(this.formData.quantiteCarburant);
    const cout = Number(this.formData.coutTotal);

    if (!Number.isFinite(quantite) || quantite <= 0) {
      this.error = 'La quantite de carburant doit etre un nombre positif';
      return;
    }

    if (!Number.isFinite(cout) || cout <= 0) {
      this.error = 'Le cout total doit etre un nombre positif';
      return;
    }

    const requestData: ConsommationRequest = {
      vehiculeId: Number(this.formData.vehiculeId),
      date: this.formData.date,
      quantiteCarburant: quantite,
      coutTotal: cout
    };

    this.loading = true;

    const handleSuccess = () => {
      this.loadConsommations();
      this.closeModal();
      this.loading = false;
    };

    const handleError = (err: any) => {
      console.error('Error saving consommation:', err);
      this.error = this.isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation';
      this.loading = false;
    };

    if (this.isEditMode && this.selectedConsommation) {
      this.consommationService.update(this.selectedConsommation.id, requestData).subscribe({
        next: handleSuccess,
        error: handleError
      });
      return;
    }

    this.consommationService.create(requestData).subscribe({
      next: handleSuccess,
      error: handleError
    });
  }

  deleteConsommation(id: number): void {
    if (confirm('Etes-vous sur de vouloir supprimer cette consommation ?')) {
      this.loading = true;
      this.consommationService.delete(id).subscribe({
        next: () => {
          this.loadConsommations();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting consommation:', err);
          this.error = 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
  }
}
