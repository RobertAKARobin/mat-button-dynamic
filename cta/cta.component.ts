/*
A wrapper around mat-button, https://material.angular.io/components/button

# Usage
## Button
```
<cta
    (trigger)="handleCtaClick($event)"
>
    Hello
</cta>
```

## Styled button
```
<cta
    appearance="stroked"
    color="accent"
>
    Click me
</cta>
```

## Link
```
<cta
    appearance="flat"
    color="primary"
    href="http://foo.com"
>
    Link
</cta>
```

## Submit button
```
<cta
    appearance="raised"
    color="warn"
    type="submit"
>
    Submit
</cta>
```

# Motivation
- A single standardized/centralized component for rendering CTAs, which are used everywhere and thus can be hard to keep consistent, and
- To be able to pass JSON into <cta-set> and render any type of button
- Angular Material provides no way to dynamically change <mat-button> types. See https://github.com/angular/components/issues/15367. If that is resolved, this component can be much simpler/unnecessary.
*/

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';
import { ThemePalette as MatButtonColor } from '@angular/material/core';
import { assert } from 'src/app/shared/utilities/assert';

export { MatButtonColor };

export enum MatButtonAppearance {
    default = 'mat-button',
    raised = 'mat-raised-button',
    stroked = 'mat-stroked-button',
    flat = 'mat-flat-button',
} // TODO:P3 - 'icon', 'fab', 'minifab'

export enum MatButtonTag {
    a = 'a',
    button = 'button',
}

export enum HTMLButtonType { // https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement
    submit = 'submit',
    reset = 'reset',
    button = 'button',
    menu = 'menu',
}

export const appearanceNames = Object.keys(MatButtonAppearance);
export const buttonTypeNames = Object.keys(HTMLButtonType);
export const buttonColors: Array<MatButtonColor> = [
    'primary',
    'accent',
    'warn',
    undefined,
];

export interface CtaBase {
    appearance: keyof typeof MatButtonAppearance;
    color: MatButtonColor;
    cssClass?: string;
    disabled?: boolean;
    label?: string;
    name?: string;
    preventDefault?: boolean;
}

export interface CtaAnchor extends CtaBase {
    href: HTMLAnchorElement['href'];
    rel?: HTMLAnchorElement['rel'];
    target?: HTMLAnchorElement['target'];
}

export interface CtaButton extends CtaBase {
    type: keyof typeof HTMLButtonType;
}

export type Cta = CtaAnchor | CtaButton;

export interface CtaInput {
    appearance: string;
    color: string;
    disabled: CtaBase['disabled'];
    href: CtaAnchor['href'];
    label: CtaBase['label'];
    name: CtaBase['name'];
    preventDefault: CtaBase['preventDefault'];
    rel: CtaAnchor['rel'];
    target: CtaAnchor['target'];
    type: string;
}

export type CtaTriggerEvent = {
    name: string;
    cta: Cta;
    event: MouseEvent | PointerEvent;
};

@Component({
    selector: 'cta',
    templateUrl: './cta.component.html',
})
export class CtaComponent implements OnChanges, CtaInput {
    cta: Cta;
    ctaAnchor: CtaAnchor;
    ctaButton: CtaButton;
    tag: MatButtonTag;

    @Input() appearance: string;
    @Input() color: string;
    @Input() disabled: CtaBase['disabled'];
    @Input() href: CtaAnchor['href'];
    @Input() label: CtaBase['label'];
    @Input() name: CtaBase['name'];
    @Input() preventDefault: CtaBase['preventDefault'];
    @Input() rel: CtaAnchor['rel'];
    @Input() target: CtaAnchor['target'];
    @Input() type: string;

    @Output() trigger = new EventEmitter<CtaTriggerEvent>(); // Not naming it 'click' since could be a tab, touch, etc

    ngOnChanges(): void {
        const ctaBase: CtaBase = {
            appearance: (this.appearance || 'default') as CtaBase['appearance'],
            color: this.color as CtaBase['color'],
            disabled: this.disabled,
            label: this.label,
            name: this.name,
            preventDefault: this.preventDefault,
        };
        assert((x) => appearanceNames.includes(x), ctaBase.appearance);
        assert(
            (x) => buttonColors.includes(x as MatButtonColor),
            ctaBase.color
        );
        if (this.href) {
            this.ctaButton = null;
            this.cta = this.ctaAnchor = {
                ...ctaBase,
                href: this.href as CtaAnchor['href'], // These 'as' aren't strictly necessary, since HTMLAnchorElement properties are all just strings, but I want to be explicit
                rel: this.rel as CtaAnchor['rel'],
                target: this.target as CtaAnchor['target'],
            };
        } else {
            this.ctaAnchor = null;
            this.cta = this.ctaButton = {
                ...ctaBase,
                type: (this.type || 'button') as CtaButton['type'],
            };
            assert((x) => buttonTypeNames.includes(x), this.cta.type);
        }
    }

    handleClick($event: CtaTriggerEvent['event']): void {
        if (this.preventDefault) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.trigger.emit({
            name: this.cta.name,
            cta: this.cta,
            event: $event,
        });
    }
}
