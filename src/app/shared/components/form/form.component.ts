import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;

  @Output() public submitted = new EventEmitter();

  constructor(private fb: FormBuilder) {
    // initialise le form
    this.form = this.fb.group({
      category: ['première guerre mondiale'],
      quizzlength: ['dix']
    });
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.form.value);
    //envoyer l'objet à tab1
    this.submitted.next(this.form.value);
  }
}
