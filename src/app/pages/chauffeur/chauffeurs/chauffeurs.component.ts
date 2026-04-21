import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChauffeurService } from '../../../services/chauffeur/chauffeur.service';
import { Chauffeur, ChauffeurRequest } from '../../../models/chauffeur/chauffeur.model';

@Component({
  selector: 'app-chauffeurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chauffeurs.component.html',
  styleUrls: ['./chauffeurs.component.css']
})
export class ChauffeursComponent implements OnInit {
  chauffeurs: Chauffeur[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEditMode = false;
  selectedChauffeur: Chauffeur | null = null;
  hasNewImage = false;
  imageFile: File | null = null;

  formData: ChauffeurRequest = {
    nom: '',
    permis: '',
    experience: 0,
    imageData: undefined
  };

  constructor(private chauffeurService: ChauffeurService) {}

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  loadChauffeurs(): void {
    this.loading = true;
    this.error = '';
    this.chauffeurService.getAll().subscribe({
      next: (data) => {
        this.chauffeurs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading chauffeurs:', err);
        this.error = 'Erreur lors du chargement des chauffeurs';
        this.loading = false;
      }
    });
  }

  openModal(chauffeur?: Chauffeur): void {
    this.showModal = true;
    this.hasNewImage = false;
    this.imageFile = null;
    this.error = '';

    if (chauffeur) {
      this.isEditMode = true;
      this.selectedChauffeur = chauffeur;
      this.formData = {
        nom: chauffeur.nom,
        permis: chauffeur.permis,
        experience: chauffeur.experience,
        imageData: undefined
      };
    } else {
      this.isEditMode = false;
      this.selectedChauffeur = null;
      this.resetForm();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      permis: '',
      experience: 0,
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

  saveChauffeur(): void {
    if (!this.formData.nom || !this.formData.permis) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const expRaw = Number(this.formData.experience);
    const experience = Math.trunc(expRaw);
    if (!Number.isFinite(expRaw) || experience < 0) {
      this.error = "L'experience doit etre un nombre positif ou nul";
      return;
    }

    this.loading = true;

    const placeholderImageBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const requestData: ChauffeurRequest = {
      nom: this.formData.nom.trim(),
      permis: this.formData.permis.trim(),
      experience,
      imageData: placeholderImageBase64
    };

    let fileToUpload: File | null = null;
    if (this.hasNewImage && this.imageFile) {
      fileToUpload = this.imageFile;
    } else if (this.isEditMode && this.selectedChauffeur?.imageData) {
      fileToUpload = this.base64ToFile(this.selectedChauffeur.imageData, 'chauffeur-image');
    }

    const handleSuccess = (chauffeurId: number) => {
      if (fileToUpload) {
        this.chauffeurService.uploadImage(chauffeurId, fileToUpload).subscribe({
          next: () => {
            this.loadChauffeurs();
            this.closeModal();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error uploading image:', err);
            this.error = "Chauffeur sauvegarde, mais erreur lors de l'upload de l'image";
            this.loadChauffeurs();
            this.closeModal();
            this.loading = false;
          }
        });
        return;
      }

      this.loadChauffeurs();
      this.closeModal();
      this.loading = false;
    };

    const handleError = (err: any) => {
      console.error('Error saving chauffeur:', err);
      this.error = this.isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la creation';
      this.loading = false;
    };

    if (this.isEditMode && this.selectedChauffeur) {
      const chauffeurId = this.selectedChauffeur.id;
      this.chauffeurService.update(chauffeurId, requestData).subscribe({
        next: () => handleSuccess(chauffeurId),
        error: handleError
      });
      return;
    }

    this.chauffeurService.create(requestData).subscribe({
      next: (created) => handleSuccess(created.id),
      error: handleError
    });
  }

  deleteChauffeur(id: number): void {
    if (confirm('Etes-vous sur de vouloir supprimer ce chauffeur ?')) {
      this.loading = true;
      this.chauffeurService.delete(id).subscribe({
        next: () => {
          this.loadChauffeurs();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting chauffeur:', err);
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
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.imageData = String(reader.result ?? '');
      };
      reader.readAsDataURL(file);
    }
  }
}
