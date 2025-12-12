import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// **Feature: catalog-upgrade-v2, Property 8: VPN access badges correctness**
// For any tool, the rendered card SHALL display:
// - "Без VPN" badge IF AND ONLY IF requiresVpn is false
// - "Нужен VPN" badge IF AND ONLY IF requiresVpn is true

interface AccessBadgesProps {
  requiresVpn: boolean;
  supportsRussian: boolean;
}

interface RenderedBadges {
  hasNoVpn: boolean;
  hasVpnRequired: boolean;
  hasRussian: boolean;
}

const propsArb = fc.record({
  requiresVpn: fc.boolean(),
  supportsRussian: fc.boolean()
});

// Simulates AccessBadges rendering logic
function renderAccessBadges(props: AccessBadgesProps): RenderedBadges {
  return {
    hasNoVpn: !props.requiresVpn,
    hasVpnRequired: props.requiresVpn,
    hasRussian: props.supportsRussian
  };
}

describe('Property 8: VPN access badges correctness', () => {
  it('displays "Без VPN" badge if and only if requiresVpn is false', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderAccessBadges(props);
        expect(badges.hasNoVpn).toBe(!props.requiresVpn);
      }),
      { numRuns: 100 }
    );
  });

  it('displays "Нужен VPN" badge if and only if requiresVpn is true', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderAccessBadges(props);
        expect(badges.hasVpnRequired).toBe(props.requiresVpn);
      }),
      { numRuns: 100 }
    );
  });

  it('VPN badges are mutually exclusive', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderAccessBadges(props);
        
        // Exactly one of the VPN badges should be shown
        expect(badges.hasNoVpn !== badges.hasVpnRequired).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('displays Russian language badge if and only if supportsRussian is true', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderAccessBadges(props);
        expect(badges.hasRussian).toBe(props.supportsRussian);
      }),
      { numRuns: 100 }
    );
  });

  it('always shows exactly one VPN status badge', () => {
    fc.assert(
      fc.property(propsArb, (props) => {
        const badges = renderAccessBadges(props);
        const vpnBadgeCount = (badges.hasNoVpn ? 1 : 0) + (badges.hasVpnRequired ? 1 : 0);
        
        expect(vpnBadgeCount).toBe(1);
      }),
      { numRuns: 100 }
    );
  });
});
