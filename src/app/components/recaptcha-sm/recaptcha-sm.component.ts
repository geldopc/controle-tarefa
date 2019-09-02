import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recaptcha-sm',
  templateUrl: './recaptcha-sm.component.html',
  styleUrls: ['./recaptcha-sm.component.css']
})
export class RecaptchaSmComponent {

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

}
