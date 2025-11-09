import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private contact = inject(ContactService);

  loading = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
    // Honeypot (muss leer bleiben – Bot füllt’s i.d.R. aus)
    website: ['']
  });

  touched(ctrl: keyof typeof this.form.controls) {
    const c = this.form.controls[ctrl];
    return c.touched || c.dirty;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Honeypot check
    if (this.form.value.website) return;

    this.loading.set(true);
    try {
      await this.contact.sendMail({
        name: this.form.value.name!,
        email: this.form.value.email!,
        message: this.form.value.message!,
      });
      // -> Hier gern deinen vorhandenen Toast nutzen:
      // this.toast.success('E-Mail wurde verschickt ✅');
      alert('E-Mail wurde verschickt ✅');
      this.form.reset();
    } catch (e) {
      // this.toast.error('Senden fehlgeschlagen ❌');
      alert('Senden fehlgeschlagen ❌');
    } finally {
      this.loading.set(false);
    }
  }

  



}
