// reservation.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../reservation.service';
import { FactureService } from '../facture.service'; // Assurez-vous que le chemin est correct
import * as moment from 'moment';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationArray: { id: number, date_debut: Date; date_fin: Date }[] = [];
  newReservation: { id: number; date_debut: Date; date_fin: Date } = { id: 0, date_debut: new Date(), date_fin:new Date() };
  
  constructor(
    private dataService: ReservationService,
    private factureService: FactureService, // Injectez le service FactureService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReservationData();
  }

  loadReservationData() {
    this.dataService.getAllReservations().subscribe(
      (data: any[]) => {
        console.log('Server response:', data);

        if (Array.isArray(data) && data.length > 0) {
          this.reservationArray = data.map((reservation: { id: number; date_debut: Date; date_fin: Date }) => ({
            id: reservation.id,
            date_debut: reservation.date_debut,
            date_fin: reservation.date_fin
          }));
        } else {
          console.warn('Data is not an array or is empty:', data);
        }
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onSubmit() {
    // Utilisez Moment.js pour formater les dates
    const formattedDateDebut = moment(this.newReservation.date_debut).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDateFin = moment(this.newReservation.date_fin).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    // Convertissez les chaînes formatées en objets Date
    this.newReservation.date_debut = new Date(formattedDateDebut);
    this.newReservation.date_fin = new Date(formattedDateFin);
    
    this.dataService.postData(this.newReservation).subscribe(
      response => {
        console.log('Server response after save:', response);
        this.loadReservationData();
        
        // Enregistrez les données de réservation dans le service FactureService
        this.factureService.setReservationData(response);
        
        // Naviguez vers le composant suivant (paiement)
        this.router.navigate(['/client']);
      },
      error => {
        console.error('Error saving data:', error);
      });

    // Reset the form
    this.resetForm();
  }

  private resetForm() {
    this.newReservation = { id: 0, date_debut: new Date(), date_fin: new Date() };
  }
}
