const fs = require('fs');
const path = require('path');

const WP_API_URL = process.env.WP_API_URL || 'https://janfranko.com/wp-json/wp/v2';
const WP_USERNAME = process.env.WP_USERNAME || 'sabamalik';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || 'ykt0 epge OO6z WmkQ xzHE to0A';

const authHeader = 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

const descriptions = {
  104: "Explore master-crafted traditional bows spanning historical Asiatic, European, and regional traditions, individually engineered for authentic tiller and performance.",
  112: "Historical Asiatic composite-style bows featuring bio-composite and modern laminate constructions modeled after Ottoman, Magyar, Mongol, and Manchu designs.",
  138: "Traditional European longbows, flatbows, and medieval-style bows crafted with authentic wooden tillering and historical geometry.",
  110: "Reliable, field-tested traditional bows designed for daily practice, academy training, and archery practitioners at all skill levels.",
  111: "Exclusive, limited-run bow editions incorporating rare exotic tonewoods, custom horn accents, and specialized craftsman signatures.",
  139: "Unique traditional bow designs inspired by highland and Himalayan mountain archery traditions, built for resilience and stability.",
  140: "Authentic traditional bows commemorating native and indigenous archery heritage across distinct global shooting styles.",
  185: "Bespoke traditional bows tailored precisely to your specific draw length, draw weight, wood grain preferences, and custom finish.",
  164: "Heavy-draw traditional hunting bows designed for silent release, maximum arrow kinetic energy, and field maneuverability.",
  166: "Hand-numbered collector-grade bows constructed with rare limb laminations and artisan craftsmanship.",
  163: "Classic D-section and flatbow longbow designs offering smooth draw cycles and timeless traditional aesthetics.",
  162: "One-piece and working-recurve traditional bows offering rapid arrow speed and comfortable handling.",
  165: "Lightweight traditional bows scaled for younger archers, promoting proper historical posture and technique.",
  108: "Authentic gear and essential accoutrements, meticulously crafted to complement your traditional bow and elevate your historical archery experience.",
  106: "Handcrafted leather quivers designed for field archery, horse archery, and traditional target shooting.",
  121: "Ergonomic hip and side field quivers engineered for easy arrow retrieval and comfortable movement on field courses.",
  120: "Historical mounted-archery quivers designed for secure arrow retention and rapid blind drawing on horseback.",
  173: "Durable hand-tooled leather belts tailored to support quivers, pouches, and traditional archery gear.",
  169: "Protective leather bracers and arm guards handcrafted from premium hides for forearm safety and historical look.",
  172: "Soft and reinforced bow sleeves and transport cases designed to protect traditional wooden limbs from moisture and impact.",
  170: "Precision leather finger tabs providing clean string release and finger protection for split-finger and three-under shooting.",
  171: "Traditional horn, leather, and metal thumb rings engineered for Asiatic thumb draw release.",
  105: "Precision wooden, bamboo, and premium carbon arrow shafts, fletchings, and fully assembled traditional arrows.",
  118: "Hand-sorted natural bamboo arrows offering exceptional toughness, natural taper, and traditional flight dynamics.",
  168: "Modern high-strength carbon shafts finished with wood-grain aesthetics for consistent spine tolerance and flight.",
  119: "Lightweight spruce arrow shafts sorted for grain straightness and optimized grain alignment.",
  167: "Hand-fletched wooden arrows bound with natural thread and fitted with authentic points or field tips.",
  107: "Durable archery targets, foam backstops, and authentic target faces designed for traditional bow practice.",
  178: "Realistic 3D animal and historical target silhouettes for field archery and instinctive shooting training.",
  179: "High-density self-healing foam target blocks built to stop heavy traditional arrows without damaging shafts.",
  177: "Traditional Kyudo-style target faces and mats crafted for formal target practice.",
  176: "Traditional Korean Gungdo distance target faces designed for outdoor target practice.",
  174: "Sur-style targets and traditional leather target cylinders used in historical steppe archery competitions.",
  175: "Puta-style target faces designed for Ottoman target archery and flight archery practice.",
  180: "High-visibility paper and woven target faces for field, indoor, and traditional archery range scoring.",
  109: "Complete archery sets and practice packages curated for beginner archers, academy students, and retreat centers.",
  181: "All-in-one starter bundles including bow, arrows, arm guard, and tab for newcomers to traditional archery.",
  183: "Bulk archery practice equipment sets designed for workshops, academy retreats, and group instruction.",
  182: "Complete youth traditional archery kits tailored with safe draw weights and scaled accessories.",
  114: "Showcase of legendary master bowyer workshops whose craftsmanship and historical bow designs grace our armory.",
  184: "Master bowyer workshop renowned for precision wood selection and traditional Hungarian bow craftsmanship.",
  116: "Distinguished master bowyer specializing in traditional longbows and high-performance wooden laminations.",
  115: "Master craftsman Kady's signature line of traditional recurves, longbows, and custom hunting bows.",
  154: "Collector-grade custom bow creations crafted by master bowyer Kady using rare exotic woods.",
  153: "Heavy-duty traditional hunting bows crafted by master bowyer Kady for silent power and precision.",
  151: "Hand-tilled traditional longbows by master bowyer Kady with smooth draw curves and beautiful finishes.",
  152: "High-performance traditional recurve bows engineered by master bowyer Kady.",
  117: "Renowned workshop MR Bows crafting historical composite-style Asiatic bows and custom traditional gear.",
  28: "Comprehensive catalog of traditional bows, quivers, arrows, targets, and bowyer accessories curated by Jan Franko Academy."
};

async function updateCategoryDescriptions() {
  console.log(`Starting WordPress category description updates for ${Object.keys(descriptions).length} categories...`);

  for (const [idStr, description] of Object.entries(descriptions)) {
    const id = parseInt(idStr, 10);
    const url = `${WP_API_URL}/product_cat/${id}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({ description })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ Failed to update category ID ${id}: Status ${res.status} - ${errText}`);
      } else {
        const data = await res.json();
        console.log(`✅ Category ID ${id} (${data.name}) updated successfully.`);
      }
    } catch (err) {
      console.error(`❌ Exception updating category ID ${id}:`, err);
    }
  }

  console.log('Finished updating category descriptions on WordPress!');
}

updateCategoryDescriptions();
