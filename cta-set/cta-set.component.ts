/*
A group of mixed buttons/ctas. See cta/cta.component.ts.

# Usage:
```
isSubmitted = false
myCtas = [
    {
        "label": "Cancel",
        "href": "http://foo.com",
    },
    {
        "color": "primary",
        "appearance": "raised",
        "type": "submit",
        "label": "submit"
    }
]
```

```
<cta-set
    class="grid__row"
    ctaCssClass="grid__row__item"
    [disabled]="isSubmitted"
    [ctas]="myCtas"
    (trigger)="handleCtaClick($event)"
></cta-set>
```
*/

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';

import {
    CtaInput,
    CtaTriggerEvent,
} from 'src/app/shared/components/cta/cta.component';

interface CtaSetInput extends CtaInput {
    cssClass: string;
}

@Component({
    selector: 'cta-set',
    templateUrl: './cta-set.component.html',
})
export class CtaSetComponent implements OnChanges {
    ctas: Array<Partial<CtaSetInput>>;

    @Input() ctaCssClass: string;
    @Input() disabled: boolean;
    @Input() preventDefault: boolean;
    @Input('ctas') inputCtas: Array<Partial<CtaInput>>;

    @Output() trigger = new EventEmitter<CtaTriggerEvent>();

    ngOnChanges(): void {
        this.ctas = this.inputCtas.map((ctaInput) => {
            return {
                ...ctaInput,
                disabled: this.disabled || ctaInput.disabled,
                preventDefault: this.preventDefault || ctaInput.preventDefault,
            };
        });
    }
}
