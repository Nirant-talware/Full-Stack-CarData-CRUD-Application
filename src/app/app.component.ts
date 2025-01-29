import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { CarService } from './Services/car.service';
import { Car } from './car.model';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  isNewUser: boolean = false;
  carObj: Car = new Car();
  carList: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe(
      (data) => {
        this.carList = data;
        console.log('Cars data received:', data);
      },
      (error) => {
        console.error('Error loading cars', error);
      }
    );
  }

  changeView() {
    if (this.isNewUser) {
      this.carObj = new Car();  
    }
    this.isNewUser = !this.isNewUser;
  }

  onSave() {
    if (this.carObj.isAgree) {
      this.carService.addCar(this.carObj).subscribe(
        (newCar) => {
          this.carList.push(newCar); 
          this.carObj = new Car();
          this.isNewUser = false;
        },
        (error) => {
          console.error('Error saving car', error);
        }
      );
    } else {
      alert('You must agree to the terms and conditions.');
    }
  }

  onUpdate() {
    this.carService.updateCar(this.carObj.Car_Id, this.carObj).subscribe(
      (updatedCar) => {
        const index = this.carList.findIndex((car) => car.Car_Id === updatedCar.Car_Id);
        if (index !== -1) {
          this.carList[index] = updatedCar;
        }
        this.changeView();
      },
      (error) => {
        console.error('Error updating car', error);
      }
    );
  }

  onEdit(data: Car) {
    this.carObj = { ...data };
    this.changeView();
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();  
      formData.append('image', file, file.name);
  
      this.carService.uploadImage(formData).subscribe(
        (response: any) => {
          this.carObj.ImageUrl = response.ImageUrl;  
        },
        (error) => {
          console.error('Error uploading image', error);
        }
      );
    }
  }
  
  onViewImage(car: Car) {
    const modal = document.getElementById('imageModal') as any;
    const modalImage = document.getElementById('modalImage') as any;

    if (car.ImageUrl) {
      modal.style.display = 'block';
      modalImage.src = car.ImageUrl;
    }
  }
  
  onCloseModal() {
    const modal = document.getElementById('imageModal') as any;
    modal.style.display = 'none';
  }
  
  

  onDelete(carId: number) {
    const isDelete = confirm('Are you sure you want to delete');
    if (isDelete) {
      this.carService.deleteCar(carId).subscribe(
        () => {
          this.carList = this.carList.filter((car) => car.Car_Id !== carId);
        },
        (error) => {
          console.error('Error deleting car', error);
        }
      );
    }
  }

}