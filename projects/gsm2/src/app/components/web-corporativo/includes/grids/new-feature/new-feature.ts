import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-feature',
  templateUrl: 'new-feature.html'
})
export class NewFeatureComponent {

    @Input() message: string;

}
