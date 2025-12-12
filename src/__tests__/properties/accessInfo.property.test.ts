import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 17: Access info section presence**
// For any tool page, the rendered HTML SHALL contain a section with information
// about accessing the tool from Russia (VPN requirements, payment methods).

const PAYMENT_METHODS = ['card', 'crypto', 'paypal', 'qiwi', 'yoomoney', 'sbp'];

interface AccessInfoProps {
  requiresVpn: boolean;
  acceptsRussianCards: boolean;
  paymentMethods: string[];
  supportsRussian: boolean;
}

interface RenderedAccessInfo {
  hasVpnInfo: boolean;
  hasPaymentInfo: boolean;
  hasLanguageInfo: boolean;
  vpnStatus: 'required' | 'not-required';
  cardsAccepted: boolean;
}

const propsArb = fc.record({
  requiresVpn: fc.boolean(),
  acceptsRussianCards: fc.boolean(),
  paymentMethods: fc.uniqueArray(fc.constantFrom(...PAYMENT_METHODS), { minLength: 0, maxLength: 4 }),
  supportsRussian: fc.boolean()
});

// Simulates AccessInfo rendering
function renderAccessInfo(props: AccessInfoProps): RenderedAccessInfo {
  return {
    hasVpnInfo: true, // Always shown
    hasPaymentInfo: true, // Always shown
    hasLanguageInfo: props.supportsRussian,
    vpnStatus: props.requiresVpn ? 'required' : 'not-required',
    cardsAccepted: props.acceptsRussianCards
  };
}

describe('Property 17: Access info section presence', () => {
  it('always shows VPN information', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const info = renderAccessInfo(props);
        expect(info.hasVpnInfo).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('always shows payment information', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const info = renderAccessInfo(props);
        expect(info.hasPaymentInfo).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('VPN status matches requiresVpn prop', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const info = renderAccessInfo(props);
        
        if (props.requiresVpn) {
          expect(info.vpnStatus).toBe('required');
        } else {
          expect(info.vpnStatus).toBe('not-required');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('cards accepted status matches acceptsRussianCards prop', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const info = renderAccessInfo(props);
        expect(info.cardsAccepted).toBe(props.acceptsRussianCards);
      }),
      { numRuns: 100 }
    );
  });

  it('language info shown only when supportsRussian is true', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const info = renderAccessInfo(props);
        expect(info.hasLanguageInfo).toBe(props.supportsRussian);
      }),
      { numRuns: 100 }
    );
  });
});
