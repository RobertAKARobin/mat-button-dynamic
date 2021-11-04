// Angular Material doesn't provide a way to dynamically generate mat-buttons. The alternative is a bunch of copying and pasting. These specs mostly make sure all the sub-templates are behaving the same way. See notes in ./cta.component.ts.

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatAnchor,
    MatButton,
    MatButtonModule,
} from '@angular/material/button';

import { MatButtonAppearance, CtaComponent } from './cta.component';

interface AttrChecker {
    [attrName: string]: {
        actual: (el: DebugElement) => unknown;
        values: Array<{
            input: unknown;
            expected: unknown;
        }>;
    };
}

const attrsBase: AttrChecker = {
    color: {
        actual: (el) => el.children[0].attributes['ng-reflect-color'],
        values: [
            {
                input: undefined,
                expected: undefined,
            },
            {
                input: 'primary',
                expected: 'primary',
            },
        ],
    },
    disabled: {
        actual: (el) => el.children[0].attributes.disabled,
        values: [
            {
                input: true,
                expected: 'true',
            },
            {
                input: false,
                expected: undefined,
            },
            {
                input: undefined,
                expected: undefined,
            },
        ],
    },
    label: {
        actual: (el) => el.children[0].nativeElement.textContent.trim(),
        values: [
            {
                input: 'foo',
                expected: 'foo',
            },
            {
                input: undefined,
                expected: '',
            },
        ],
    },
};

const attrsAnchor: AttrChecker = {
    href: {
        actual: (el) => el.children[0].attributes.href,
        values: [
            {
                input: 'https://foo.com',
                expected: 'https://foo.com',
            },
            {
                input: undefined,
                expected: undefined,
            },
        ],
    },
    rel: {
        actual: (el) => el.children[0].attributes.rel,
        values: [
            {
                input: 'noopener',
                expected: 'noopener',
            },
            {
                input: undefined,
                expected: undefined,
            },
        ],
    },
    target: {
        actual: (el) => el.children[0].attributes.target,
        values: [
            {
                input: '_blank',
                expected: '_blank',
            },
            {
                input: undefined,
                expected: undefined,
            },
        ],
    },
};

const attrsButton: AttrChecker = {
    type: {
        actual: (el) => el.children[0].attributes.type,
        values: [
            {
                input: 'submit',
                expected: 'submit',
            },
            {
                input: undefined,
                expected: 'button',
            },
        ],
    },
};

type CtaType = {
    component: typeof MatAnchor | typeof MatButton;
    href?: string;
    name: string;
    tag: string;
};

const ctaTypes: { [typeName: string]: CtaType } = {
    anchor: {
        component: MatAnchor,
        href: 'http://foo.com',
        name: 'MatAnchor',
        tag: 'a',
    },
    button: {
        component: MatButton,
        href: undefined,
        name: 'MatButton',
        tag: 'button',
    },
};

describe('CtaComponent', () => {
    let component: CtaComponent;
    let el: DebugElement;
    let fixture: ComponentFixture<CtaComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatButtonModule],
            declarations: [CtaComponent],
        });
        fixture = TestBed.createComponent(CtaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        el = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeInstanceOf(CtaComponent);
    });

    Object.values(ctaTypes).forEach((type) => {
        describe(`<cta href="${type.href}">`, () => {
            beforeEach(() => {
                component.href = type.href;
                component.ngOnChanges();
                fixture.detectChanges();
            });

            it(`should have component type ${type.name}`, () => {
                expect(component.ctaAnchor)[
                    type.href ? 'toBeTruthy' : 'toBeFalsy'
                ]();
                expect(component.ctaButton)[
                    type.href ? 'toBeFalsy' : 'toBeTruthy'
                ]();
                const childInstance = el.children[0].componentInstance;
                expect(childInstance).toBeInstanceOf(type.component);
            });

            testTypeAppearances(type);
        });
    });

    function testTypeAppearances(type: CtaType) {
        const appearances = Object.entries(MatButtonAppearance);
        appearances.forEach(([appearance, matAttribute]) => {
            describe(`<cta href="${type.href}" appearance="${appearance}">`, () => {
                beforeEach(() => {
                    component.appearance = appearance;
                    component.ngOnChanges();
                    fixture.detectChanges();
                });

                it(`should have MatButton selector '${matAttribute}'`, () => {
                    const childAttrs = Object.keys(el.children[0].attributes);
                    expect(childAttrs).toContain(matAttribute);
                });

                testAppearanceAttributes(type);
            });
        });
    }

    function testAppearanceAttributes(type: CtaType) {
        const attrsToTest = {
            ...attrsBase,
            ...(type.tag === 'a' ? attrsAnchor : attrsButton),
        };
        Object.entries(attrsToTest).forEach(([attrName, attr]) => {
            it(`should pass down [${attrName}]`, () => {
                attr.values.forEach(({ input, expected }) => {
                    component[attrName] = input;
                    component.ngOnChanges();
                    fixture.detectChanges();
                    const actual = attr.actual(el);
                    expect(actual).toEqual(expected);
                });
            });
        });
    }
});
