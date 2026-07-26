/**
 * India Post Next.js Server Action Hash Extractor
 * 
 * Usage:
 *   node extract-hashes.js
 */

import https from 'https';

const BASE_URL = 'https://www.indiapost.gov.in';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function extractHashes() {
  console.log('🔍 Fetching India Post homepage to locate Next.js script bundles...');

  try {
    const html = await fetchUrl(`${BASE_URL}/`);

    // Find all Next.js static chunk script links
    const scriptMatches = html.match(/_next\/static\/chunks\/[a-zA-Z0-9_-]+\.js/g) || [];
    const uniqueScripts = [...new Set(scriptMatches)];

    console.log(`📦 Found ${uniqueScripts.length} Next.js script bundles. Scanning for SHA-1 action hashes...`);

    const hashes = new Set();
    const shaRegex = /[a-f0-9]{40}/gi;

    for (const scriptPath of uniqueScripts) {
      try {
        const jsContent = await fetchUrl(`${BASE_URL}/${scriptPath}`);
        const found = jsContent.match(shaRegex);
        if (found) {
          found.forEach(h => hashes.add(h));
        }
      } catch (err) {
        // Skip failed script fetches
      }
    }

    const extracted = Array.from(hashes);

    console.log('\n======================================================');
    console.log('✅ EXTRACTION COMPLETE');
    console.log('======================================================');
    console.log(`Found ${extracted.length} total Next.js Server Action hashes:\n`);

    extracted.forEach((hash, idx) => {
      console.log(`  [Hash ${idx + 1}]: ${hash}`);
    });

    console.log('\nCopy these values into your .env file:');
    console.log(`VITE_NEXTJS_TOKEN_ACTION=${extracted[0]}`);
    console.log(`VITE_NEXTJS_TRACK_ACTION=${extracted[1]}`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Failed to fetch India Post website:', err.message);
  }
}

extractHashes();
