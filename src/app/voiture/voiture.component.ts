// voiture.component.ts
import { Component, OnInit } from '@angular/core';
import { VoitureService } from '../voiture.service';
import { Router } from '@angular/router';
import { FactureService } from '../facture.service';
import { SharedService } from '../shared-service.service'

@Component({
  selector: 'app-voiture',
  templateUrl: './voiture.component.html',
  styleUrls: ['./voiture.component.css']
})
export class VoitureComponent implements OnInit {
  voitureArray: { id: number, couleur: string; matricule: string; modele: string; prix_location: number; imageUrl: string; date_fab: Date }[] = [];

  constructor(
    private dataService: VoitureService,
    private factureService: FactureService,
    private SharedService: SharedService, // Inject the SharedService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVoitureData();
  }

  loadVoitureData() {
    this.dataService.getAllVoiture().subscribe(
      (data: any[]) => {
        console.log('Server response:', data);
        this.voitureArray = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  reserverVoiture(voiture: any) {
    // Chargez la voiture spécifique par ID lorsque vous réservez
    this.dataService.getVoitureById(voiture.id).subscribe(
      (data: any) => {
        console.log('Server response (Single Voiture for Reservation):', data);
        // Ajoutez la voiture spécifique à votre modèle ou effectuez d'autres traitements si nécessaire

        console.log('Reservation successful:', data);

        // Utilisez le service FactureService pour réserver la voiture
        this.factureService.reserveVoiture(data);

        // Naviguez vers le composant suivant (reservation)
        this.router.navigate(['/reservation']);

        this.SharedService.setSelectedModel(data.modele); // Update the selected model in the service
      },
      (error) => {
        console.error('Error reserving voiture:', error);
      }
    );
  }
}
