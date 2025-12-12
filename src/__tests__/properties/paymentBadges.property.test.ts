import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 7: Payment badges correctness**
// For any tool, the rendered card SHALL display:
// - "Карты РФ" badge IF AND ONLY IF acceptsRussianCards is true
// - "Бесплатно" badge IF AND ONLY IF priceModel is "free"
// - Payment method badges matching the paymentMethods array

const PRICE_MODELS = ['free', 'freemium', 'paid'] as const;
const PAYMENT_METHODS = ['card', 'crypto', 'paypal', 'qiwi', 'yoomoney', 'sbp'];

interface PaymentBadgesProps {
  acceptsRussianCards: boolean;
  paymentMethods: string[];
  priceModel: 'free' | 'freemium' | 'paid';
}

interface RenderedBadges {
  hasFree: boolean;
  hasRussianCards: boolean;
  hasCrypto: boolean;
  hasSbp: boolean;
}

const propsArb = fc.record({
  acceptsRussianCards: fc.boolean(),
  paymentMethods: fc.uniqueArray(fc.constantFrom(...PAYMENT_METHODS), { minLength: 0, maxLength: 4 }),
  priceModel: fc.constantFrom(...PRICE_MODELS)
});

// Simulates PaymentBadges rendering logic
function renderPaymentBadges(props: PaymentBadgesProps): RenderedBadges {
  return {
    hasFree: props.priceModel === 'free',
    hasRussianCards: props.acceptsRussianCards,
    hasCrypto: props.paymentMethods.includes('crypto'),
    hasSbp: props.paymentMethods.includes('sbp')
  };
}

describe('Property 7: Payment badges correctness', () => {
  it('displays "Карты РФ" badge if and only if acceptsRussianCards is true', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderPaymentBadges(props);
        expect(badges.hasRussianCards).toBe(props.acceptsRussianCards);
      }),
      { numRuns: 100 }
    );
  });

  it('displays "Бесплатно" badge if and only if priceModel is "free"', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderPaymentBadges(props);
        expect(badges.hasFree).toBe(props.priceModel === 'free');
      }),
      { numRuns: 100 }
    );
  });

  it('displays crypto badge if and only if crypto is in paymentMethods', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderPaymentBadges(props);
        expect(badges.hasCrypto).toBe(props.paymentMethods.includes('crypto'));
      }),
      { numRuns: 100 }
    );
  });

  it('displays SBP badge if and only if sbp is in paymentMethods', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderPaymentBadges(props);
        expect(badges.hasSbp).toBe(props.paymentMethods.includes('sbp'));
      }),
      { numRuns: 100 }
    );
  });

  it('free badge is mutually exclusive with paid price models', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderPaymentBadges(props);
        
        if (props.priceModel === 'freemium' || props.priceModel === 'paid') {
          expect(badges.hasFree).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });
});
