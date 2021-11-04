import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import {
    CtaBase,
    CtaAnchor,
    CtaButton,
    CtaComponent,
} from 'src/app/shared/components/cta/cta.component';
import { CtaSetComponent } from './cta-set.component';
import * as stub from './cta-set.component.stub.json';

const mockCtas = { ...stub }.ctas;

const attrsBase: Array<keyof CtaBase> = [
    'appearance',
    'color',
    'label',
    'name',
    'preventDefault',
];

const attrsAnchor: Array<keyof CtaAnchor> = ['href', 'rel', 'target'];

const attrsButton: Array<keyof CtaButton> = ['type'];

describe('CtaSetComponent', () => {
    let component: CtaSetComponent;
    let el: DebugElement;
    let fixture: ComponentFixture<CtaSetComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatButtonModule],
            declarations: [CtaComponent, CtaSetComponent],
        });
        fixture = TestBed.createComponent(CtaSetComponent);
        component = fixture.componentInstance;
        component.inputCtas = mockCtas;
        component.ngOnChanges();
        fixture.detectChanges();
        el = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeInstanceOf(CtaSetComponent);
    });

    it('should create a button for each in [ctas]', () => {
        mockCtas.forEach((mockCta, index) => {
            expect(el.children[index].componentInstance).toBeInstanceOf(
                CtaComponent
            );
        });
    });

    it('should pass down attributes', () => {
        mockCtas.forEach((mockCta, index) => {
            const attrsToTest = [
                ...attrsBase,
                ...(mockCta.href ? attrsAnchor : attrsButton),
            ];
            attrsToTest.forEach((attr) => {
                const expected = mockCta[attr];
                const cta = el.children[index];
                switch (attr) {
                    case 'label':
                        expect(cta.nativeElement.textContent.trim()).toEqual(
                            expected
                        );
                        break;
                    default:
                        expect(cta.componentInstance[attr]).toEqual(expected);
                }
            });
        });
    });

    it('children should inherit ctaCssClass', () => {
        const ctaCssClass = 'foo';
        component.ctaCssClass = ctaCssClass;
        component.ngOnChanges();
        fixture.detectChanges();
        el.children.forEach((child) => {
            expect(child.nativeElement.classList).toContain(ctaCssClass);
        });
    });

    it('children should inherit disabled, unless overridden', () => {
        component.disabled = true;
        component.ngOnChanges();
        fixture.detectChanges();
        el.children.forEach((child) => {
            expect(child.componentInstance.disabled).toBeTrue();
        });

        component.disabled = false;
        component.ngOnChanges();
        fixture.detectChanges();
        el.children.forEach((child, index) => {
            expect(child.componentInstance.disabled).toEqual(
                mockCtas[index].disabled
            );
        });
    });
});
