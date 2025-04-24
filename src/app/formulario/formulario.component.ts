import { NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../services/LocalStorageService';
import { Participante } from '../models/participant';

@Component({
   selector: 'app-formulario',
   imports: [ReactiveFormsModule, NgIf, NgClass],
   templateUrl: './formulario.component.html',
   styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {
   form!: FormGroup;
   participants!: Participante[]

   constructor(private local: LocalStorageService) { }

   ngOnInit() {
      this.form = new FormGroup({
         event: new FormControl('', Validators.required),
         modality: new FormControl('', Validators.required),
         start: new FormControl('', Validators.required),
         end: new FormControl('', Validators.required),
         passengers: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
         email: new FormControl('', [Validators.required, Validators.email])
      });

      this.form.get('event')?.setValue(this.local.get('event'))
      this.form.get('modality')?.setValue(this.local.get('modality'))
      this.form.get('start')?.setValue(this.local.get('start'))
      this.form.get('end')?.setValue(this.local.get('end'))
      this.form.get('passengers')?.setValue(this.local.get('passengers'))
      this.form.get('email')?.setValue(this.local.get('email'))
   }

   onSubmit() {
      console.log(this.form.value)
      this.reset()
   }
   reset() {
      this.local.set('event', null)
      this.local.set('modality', null)
      this.local.set('start', null)
      this.local.set('end', null)
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
      const start = this.form.get('start')?.value;
      const end = this.form.get('end')?.value;
      return this.wasTouched('start') && this.wasTouched('end') && start && end && start > end;

   }
   showInvalidPassengerNumber(): boolean {
      return this.wasTouched('passengers')
         && (this.form.get('passengers')?.hasError('min') || this.form.get('passengers')?.hasError('max')) ||
         false
   }
}
