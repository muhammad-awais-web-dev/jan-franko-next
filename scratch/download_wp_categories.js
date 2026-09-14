const fs = require('fs');
const path = require('path');

async function downloadCategories() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envText = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envText.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx !== -1) {
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  });

  const username = env.WP_USERNAME || 'sabamalik';
  const password = env.WP_APP_PASSWORD;
  const baseUrl = env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://janfranko.com/wp-json/wp/v2';
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  console.log('Fetching all product categories from WordPress REST API...');
  const res = await fetch(`${baseUrl}/product_cat?per_page=100`, {
    headers: { 'Authorization': authHeader }
  });

  if (!res.ok) {
    console.error('Failed to fetch categories:', res.status, await res.text());
    return;
  }

  const cats = await res.json();
  const summary = cats.map(c => ({
    id: c.id,
    name: c.name.replace(/&amp;/g, '&'),
    slug: c.slug,
    parent: c.parent,
    description: c.description || ""
  }));

  const outPath = path.join(__dirname, 'wp_product_categories.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`Saved ${summary.length} categories to ${outPath}`);
  console.log(JSON.stringify(summary, null, 2));
}

downloadCategories().catch(console.error);
