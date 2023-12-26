import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name:
    env.mode === 'staging'
      ? '[INTERNAL] DummyText'
      : 'DummyText',
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in 'version_name'
  version_name: version,
  description: 'Generates random dummy text (Lorem Ipsum).',
  icons: {
    16: 'media/icon19.png',
    48: 'media/icon48.png',
    128: 'media/icon128.png',
  },
  action: {
    default_icon: 'media/icon19.png',
    default_popup: 'popup.html',
  },
  offline_enabled: true,
  options_page: 'options.html',
  permissions: [
    'storage',
  ],
}));
