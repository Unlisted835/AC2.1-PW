import { NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../services/LocalStorageService';

@Component({
   selector: 'app-formulario',
   imports: [ReactiveFormsModule, NgIf, NgClass],
   templateUrl: './formulario.component.html',
   styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {
   form!: FormGroup;

   constructor(private local: LocalStorageService) { }

   ngOnInit() {
      this.form = new FormGroup({
         place: new FormControl('', Validators.required),
         going: new FormControl('', Validators.required),
         arriving: new FormControl('', Validators.required),
         passengers: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
         email: new FormControl('', [Validators.required, Validators.email])
      });

      this.form.get('place')?.setValue(this.local.get('place'))
      this.form.get('going')?.setValue(this.local.get('going'))
      this.form.get('arriving')?.setValue(this.local.get('arriving'))
      this.form.get('passengers')?.setValue(this.local.get('passengers'))
      this.form.get('email')?.setValue(this.local.get('email'))
   }

   onSubmit() {
      const destino = this.form.get('place')?.value
      const ida = this.form.get('going')?.value
      const volta = this.form.get('arriving')?.value
      const passageiros = this.form.get('passengers')?.value
      const email = this.form.get('email')?.value

      alert(
         `Destino: ${destino}\nIda: ${ida}\nVolta: ${volta}\nPassageiros: ${passageiros}\nEmail: ${email}`
      )
      console.log(this.form.value)

      this.reset()
   }
   reset() {
      this.local.set('place', null)
      this.local.set('going', null)
      this.local.set('arriving', null)
      this.local.set('passengers', null)
      this.local.set('email', null)

      this.form.reset()
   }
   onInputChange(name: string) {
      this.local.set(name, this.form.get(name)?.value)
   }

   wasTouched(name: string): boolean {
      return this.form.get(name)?.dirty || this.form.get(name)?.touched || false
   }
   showRequired(name: string): boolean {
      return this.wasTouched(name) && this.form.get(name)?.hasError('required') || false
   }
   showInvalidEmail(): boolean {
      return this.wasTouched('email') &&
         this.form.get('email')?.invalid &&
         this.form.get('email')?.errors?.['email']
   }
   showInvalidDates(): boolean {
      const going = this.form.get('going')?.value;
      const arriving = this.form.get('arriving')?.value;
      return this.wasTouched('going') && this.wasTouched('arriving') && going && arriving && going > arriving;

   }
   showInvalidPassengerNumber(): boolean {
      return this.wasTouched('passengers')
         && (this.form.get('passengers')?.hasError('min') || this.form.get('passengers')?.hasError('max')) ||
         false
   }
}
