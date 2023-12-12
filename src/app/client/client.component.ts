// client.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';
import { FactureService } from '../facture.service'; // Assurez-vous que le chemin est correct


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientArray: { id: number, nom: string; email: string; adresse: string; tel: string; }[] = [];
  newClient: { id: number; nom: string; email: string; adresse: string; tel: string; } = { id: 0, nom: '', email: '', adresse: '', tel: '' };
  

  constructor(
    private dataService: ClientService,
    private factureService: FactureService, // Injectez le service FactureService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientData();
  }

  loadClientData() {
    this.dataService.getAllClient().subscribe(
      (data: any[]) => {
        console.log('Server response:', data);

        if (Array.isArray(data) && data.length > 0) {
          this.clientArray = data.map((client: { id: number, nom: string; email: string; adresse: string; tel: string  }) => ({
            id: client.id,
            nom: client.nom,
            email: client.email ,
            adresse: client.adresse,
            tel: client.tel,
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
    this.dataService.postData(this.newClient).subscribe(
      response => {
        console.log('Server response after save:', response);
        this.loadClientData();
        
        // Enregistrez les données du client dans le service FactureService
        this.factureService.setClientData(response);
        
        // Naviguez vers le composant suivant (paiement)
        this.router.navigate(['/client/paiement']);
      },
      error => {
        console.error('Error saving data:', error);
      });

    // Reset the form
    this.resetForm();
  }

  private resetForm() {
    this.newClient = { id: 0, nom: '', email: '', adresse: '', tel: '' };
  }

  onDelete(index: number) {
    console.log(index);

    const deletedTask = this.clientArray[index];

    if (deletedTask && deletedTask.id) {
      this.dataService.deleteData(deletedTask.id).subscribe(
        response => {
          console.log('Server response after delete:', response);
          this.clientArray.splice(index, 1);
        },
        error => {
          console.error('Error deleting data:', error);
        }
      );
    } else {
      console.error('Task or Task ID is missing.');
    }
  }

  onUpdate(index: number) {
    const updatedTask = this.clientArray[index];

    if (updatedTask && updatedTask.id) {
      console.log('Updating Patient ID:', updatedTask.id);
      console.log('Updating Patient Data:', updatedTask);

      // Assign the existing data to the updatedPatientForm property
      this.newClient = { ...updatedTask };
    } else {
      console.error('Task or Task ID is missing.');
    }
  }
}
