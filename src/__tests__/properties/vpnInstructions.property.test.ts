import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// **Feature: content-value-upgrade, Property 2: VPN instruction presence**
// For any tool with requiresVpn: true, the tool's MDX content SHALL contain
// instructions for accessing the service (VPN setup or alternatives).
// **Validates: Requirements 3.3**

const TOOLS_DIR = join(process.cwd(), 'src/content/tools');

// Keywords that indicate VPN instructions are present
const VPN_INSTRUCTION_KEYWORDS = [
  'vpn',
  'впн',
  'обойти',
  'обход',
  'доступ',
  'заблокирован',
  'блокировк',
  'windscribe',
  'protonvpn',
  'nordvpn',
  'сервер',
];

interface ToolFrontmatter {
  title: string;
  requiresVpn: boolean;
}

function getToolsRequiringVpn(): { slug: string; title: string; content: string }[] {
  const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith('.mdx'));
  const toolsWithVpn: { slug: string; title: string; content: string }[] = [];

  for (const file of files) {
    const filePath = join(TOOLS_DIR, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as ToolFrontmatter;

    if (frontmatter.requiresVpn === true) {
      toolsWithVpn.push({
        slug: file.replace('.mdx', ''),
        title: frontmatter.title,
        content: content.toLowerCase(),
      });
    }
  }

  return toolsWithVpn;
}

function hasVpnInstructions(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return VPN_INSTRUCTION_KEYWORDS.some(keyword => lowerContent.includes(keyword.toLowerCase()));
}

describe('Property 2: VPN instruction presence', () => {
  const toolsRequiringVpn = getToolsRequiringVpn();

  it('should have at least one tool requiring VPN for this test to be meaningful', () => {
    expect(toolsRequiringVpn.length).toBeGreaterThan(0);
  });

  it.each(toolsRequiringVpn)(
    'tool "$title" (requiresVpn: true) should contain VPN access instructions',
    ({ title, content }) => {
      const hasInstructions = hasVpnInstructions(content);
      expect(
        hasInstructions,
        `Tool "${title}" requires VPN but does not contain VPN access instructions. ` +
        `Expected content to include keywords like: ${VPN_INSTRUCTION_KEYWORDS.join(', ')}`
      ).toBe(true);
    }
  );
});
