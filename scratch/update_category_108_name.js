const WP_API_URL = process.env.WP_API_URL || 'https://janfranko.com/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME || 'sabamalik';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'ykt0 epge OO6z WmkQ xzHE to0A';

const authHeader = 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

async function updateCategory108() {
  const url = `${WP_API_URL}/product_cat/108`;
  console.log(`Updating category ID 108 name to "Quivers & Accessories"...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ name: 'Quivers & Accessories' })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Failed to update category ID 108: Status ${res.status} - ${errText}`);
    } else {
      const data = await res.json();
      console.log(`✅ Category ID 108 updated successfully:`, { id: data.id, name: data.name, slug: data.slug });
    }
  } catch (err) {
    console.error(`❌ Exception updating category ID 108:`, err);
  }
}

updateCategory108();
