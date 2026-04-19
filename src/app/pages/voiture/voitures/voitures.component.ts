import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoitureService } from '../../../services/voiture/voiture.service';
import { Voiture, VoitureRequest } from '../../../models/voiture/voiture.model';

@Component({
  selector: 'app-voitures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voitures.component.html',
  styleUrls: ['./voitures.component.css']
})
export class VoituresComponent implements OnInit {
  voitures: Voiture[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEditMode = false;
  selectedVoiture: Voiture | null = null;
  hasNewImage = false;
  imageFile: File | null = null;

  formData: VoitureRequest = {
    immatriculation: '',
    modele: '',
    type: '',
    kilometrage: 0,
    statut: '',
    imageData: undefined
  };

  constructor(private voitureService: VoitureService) {}

  ngOnInit(): void {
    this.loadVoitures();
  }

  private normalizeStatutForApi(value: string): string {
    const raw = (value ?? '').trim();
    if (!raw) return '';

    const normalized = raw
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_');

    switch (normalized) {
      case 'actif':
      case 'en_service':
        return 'EN_SERVICE';
      case 'en_maintenance':
        return 'EN_MAINTENANCE';
      case 'hors_service':
        return 'HORS_SERVICE';
      default:
        // If backend uses enums, they are usually uppercase.
        return raw.toUpperCase();
    }
  }

  loadVoitures(): void {
    this.loading = true;
    this.error = '';
    this.voitureService.getAll().subscribe({
      next: (data) => {
        this.voitures = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading voitures:', err);
        this.error = 'Erreur lors du chargement des voitures';
        this.loading = false;
      }
    });
  }

  openModal(voiture?: Voiture): void {
    this.showModal = true;
    this.hasNewImage = false;
    this.imageFile = null;
    this.error = '';
    if (voiture) {
      this.isEditMode = true;
      this.selectedVoiture = voiture;
      // Copy fields but exclude imageData to prevent resending unchanged image
      this.formData = {
        immatriculation: voiture.immatriculation,
        modele: voiture.modele,
        type: voiture.type,
        kilometrage: voiture.kilometrage,
        statut: this.normalizeStatutForApi(voiture.statut),
        imageData: undefined
      };
    } else {
      this.isEditMode = false;
      this.selectedVoiture = null;
      this.resetForm();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      immatriculation: '',
      modele: '',
      type: '',
      kilometrage: 0,
      statut: '',
      imageData: undefined
    };
    this.imageFile = null;
    this.hasNewImage = false;
    this.error = '';
  }

  private base64ToFile(data: string, defaultFileName: string): File | null {
    if (!data) return null;

    let mime = 'image/png';
    let base64 = data;

    // data URL: data:image/png;base64,AAAA...
    if (data.startsWith('data:')) {
      const commaIndex = data.indexOf(',');
      const header = commaIndex >= 0 ? data.substring(0, commaIndex) : '';
      base64 = commaIndex >= 0 ? data.substring(commaIndex + 1) : '';

      const match = header.match(/^data:([^;]+);base64$/);
      if (match?.[1]) mime = match[1];
    }

    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mime });
      const extension = mime.split('/')[1] || 'png';
      const fileName = defaultFileName.includes('.') ? defaultFileName : `${defaultFileName}.${extension}`;
      return new File([blob], fileName, { type: mime });
    } catch {
      return null;
    }
  }

  saveVoiture(): void {
    if (!this.formData.immatriculation || !this.formData.modele || !this.formData.type || !this.formData.statut) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Validate kilometrage is a valid non-negative integer (backend uses Long)
    const kmRaw = Number(this.formData.kilometrage);
    const km = Math.trunc(kmRaw);
    if (!Number.isFinite(kmRaw) || km < 0) {
      this.error = 'Le kilométrage doit être un nombre positif';
      return;
    }

    this.loading = true;

    // Keep JSON payload small and consistent. Real image is handled via /{id}/image endpoint.
    const placeholderImageBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Build request (JSON endpoint)
    const requestData: VoitureRequest = {
      immatriculation: this.formData.immatriculation.trim(),
      modele: this.formData.modele.trim(),
      type: this.formData.type.trim(),
      kilometrage: km,
      statut: this.normalizeStatutForApi(this.formData.statut),
      imageData: placeholderImageBase64
    };

    // Decide which image to upload after JSON save:
    // - new selection => upload that
    // - no new selection in edit mode => re-upload existing image to preserve it
    let fileToUpload: File | null = null;
    if (this.hasNewImage && this.imageFile) {
      fileToUpload = this.imageFile;
    } else if (this.isEditMode && this.selectedVoiture?.imageData) {
      fileToUpload = this.base64ToFile(this.selectedVoiture.imageData, 'vehicule-image');
    }

    const handleSuccess = (vehicleId: number) => {
      if (fileToUpload) {
        console.log('Uploading image for vehicle:', vehicleId);
        this.voitureService.uploadImage(vehicleId, fileToUpload).subscribe({
          next: () => {
            this.loadVoitures();
            this.closeModal();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error uploading image:', err);
            this.error = "Véhicule sauvegardé, mais erreur lors de l'upload de l'image";
            this.loadVoitures();
            this.closeModal();
            this.loading = false;
          }
        });
        return;
      }

      this.loadVoitures();
      this.closeModal();
      this.loading = false;
    };

    const handleError = (err: any) => {
      console.error('Error saving voiture:', err);
      console.error('Error status:', err?.status);
      console.error('Error body:', err?.error);
      this.error = this.isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la création';
      this.loading = false;
    };

    if (this.isEditMode && this.selectedVoiture) {
      const vehicleId = this.selectedVoiture.id;
      console.log('Updating vehicle id=', vehicleId, {
        ...requestData,
        imageData: `base64(${requestData.imageData?.length ?? 0})`
      });
      this.voitureService.update(vehicleId, requestData).subscribe({
        next: () => handleSuccess(vehicleId),
        error: handleError
      });
      return;
    }

    // CREATE
    console.log('Creating vehicle', {
      ...requestData,
      imageData: `base64(${requestData.imageData?.length ?? 0})`
    });
    this.voitureService.create(requestData).subscribe({
      next: (created) => handleSuccess(created.id),
      error: handleError
    });
  }

  deleteVoiture(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      this.loading = true;
      this.voitureService.delete(id).subscribe({
        next: () => {
          this.loadVoitures();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting voiture:', err);
          this.error = 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;
    if (file) {
      this.hasNewImage = true;
      this.imageFile = file;
      // Create preview for the template
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.imageData = String(reader.result ?? '');
      };
      reader.readAsDataURL(file);
    }
  }
}
