/**
 * Helper utilities for model-wise product grouping and variant resolution across all brands
 */

/**
 * Parses storage/RAM string into numeric gigabytes for accurate sorting
 * e.g. "128GB" -> 128, "128 GB" -> 128, "1TB" -> 1024, "2 TB" -> 2048
 */
export function parseStorageCapacity(str) {
  if (!str) return 0;
  const s = String(str).toUpperCase().trim();
  if (s.includes('TB')) {
    const val = parseFloat(s.replace(/[^0-9.]/g, '')) || 1;
    return val * 1024;
  }
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Extracts storage text from name, label, or SKU
 * e.g. "iPhone 16 128 GB (Black)" -> "128GB"
 * e.g. "OnePlus N6x 5G (Burgundy Red, 4GB+128GB, 7000mAh Battery)" -> "128GB"
 * e.g. "VIVO Y11 (4+128)" -> "128GB"
 * e.g. "S26ultra 12_256" -> "256GB"
 */
export function extractStorageFromText(str) {
  if (!str) return '';
  const s = String(str);

  // 1. Check for RAM+Storage patterns like "4GB+128GB", "12_256", "4+64G", "12+512", "16GB+512GB", "(4+128)"
  const combo = s.match(/(?:\(?\b\d+\s*(?:GB|G|RAM)?\s*[\+_]\s*|\b\d+\s*RAM\s*[\+,]\s*)(\d+)\s*(GB|G|TB)?/i);
  if (combo) {
    const num = combo[1];
    const unit = (combo[2] || '').toUpperCase();
    return unit.includes('TB') ? `${num}TB` : `${num}GB`;
  }

  // 2. Check for explicit storage/ROM patterns like "128GB ROM", "256 GB Storage", "512GB internal"
  const rom = s.match(/(\d+)\s*(GB|TB)\s*(?:ROM|Storage|Internal|NVMe)/i);
  if (rom) {
    return `${rom[1]}${rom[2].toUpperCase()}`;
  }

  // 3. Match any GB/TB that is NOT immediately followed by RAM
  const matches = [...s.matchAll(/\b(\d+)\s*(GB|TB)\b(?!\s*RAM)/gi)];
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    return `${last[1]}${last[2].toUpperCase()}`;
  }

  // 4. Single standard match
  const m = s.match(/\b(\d+)\s*(GB|TB)\b/i);
  if (m) {
    return `${m[1]}${m[2].toUpperCase()}`;
  }
  return '';
}

/**
 * Robustly extracts the core model name for all brands (Apple, Samsung, OnePlus, Vivo, Oppo, etc.)
 */
export function extractModelFamily(product) {
  if (!product) return '';
  const name = product.name || '';
  const brand = (product.brand || '').toLowerCase();
  const modelGroup = product.modelGroup || '';
  const clean = name.trim();

  // 1. Explicit modelGroup if specified
  if (modelGroup && modelGroup.trim()) {
    return modelGroup.trim();
  }

  // 2. Apple Products (iPhones, Watches, AirPods)
  if (brand.includes('apple') || /iphone|airpods|apple watch/i.test(clean)) {
    const m = clean.match(/(Apple\s+)?(iPhone\s+(?:Duo|Air|18\s+Pro\s+Max|18\s+Pro|18|17\s+Pro\s+Max|17\s+Pro|17\s+Plus|17e|17|16\s+Pro\s+Max|16\s+Pro|16\s+Plus|16e|16|15\s+Pro\s+Max|15\s+Pro|15\s+Plus|15|14\s+Pro\s+Max|14\s+Pro|14|13|SE|XR|XS|X))/i);
    if (m) return 'Apple ' + m[2].replace(/\s+/g, ' ').trim();

    const w = clean.match(/(Apple\s+)?(Watch\s+Series\s+\d+|Watch\s+S\d+|Apple\s+Watch\s+\w+)/i);
    if (w) return (w[1] || 'Apple ') + w[2].trim();

    const a = clean.match(/(Apple\s+)?(AirPods\s+Pro\s+\d+|AirPods\s+\d+|AirPods\s+Max)/i);
    if (a) return (a[1] || 'Apple ') + a[2].trim();
  }

  // 3. Samsung Galaxy
  if (brand.includes('samsung') || /galaxy|s26|s25|z\s*fold/i.test(clean)) {
    const s = clean.match(/(Samsung\s+)?(Galaxy\s+(?:S\d+\s+Ultra|S\d+\s+Plus|S\d+\s+FE|S\d+|Z\s+Fold\s+\d+\s+Ultra|Z\s+Fold\s+\d+|Z\s+Flip\s+\d+|A\d+\s*5G|A\d+|M\d+\s*5G|M\d+|F\d+\s*5G|F\d+))/i);
    if (s) return 'Samsung ' + s[2].replace(/\s+/g, ' ').trim();

    const short = clean.match(/^(?:Samsung\s+)?(S\d+\s*Ultra|S\d+\s*FE|S\d+|Fold\s*\d+\s*Ultra|Fold\s*\d+|A\d+|F\d+)/i);
    if (short) return 'Samsung Galaxy ' + short[1].trim();
  }

  // 4. OnePlus
  if (brand.includes('oneplus') || /oneplus/i.test(clean)) {
    const op = clean.match(/(OnePlus\s+(?:Open\s+\d+|Open|13\s+Pro|13R|13|12\s+Pro|12R|12|11|Nord\s+\w+|N\w+))/i);
    if (op) return op[0].trim();
  }

  // 5. Vivo
  if (brand.includes('vivo') || /vivo/i.test(clean)) {
    const v = clean.match(/(Vivo\s+(?:X\s*Fold\s*\d+|X\d+\s*Ultra|X\d+\s*FE|X\d+\s*Pro\+|X\d+\s*Pro|X\d+|V\d+\s*Pro|V\d+e|V\d+\s*Elite|V\d+\s*FE|V\d+|Y\d+\s*Pro|Y\d+\s*5G|Y\d+|S\d+|T\d+\s*Ultra|T\d+\s*Pro|T\d+x|T\d+\s*Lite|T\d+))/i);
    if (v) return v[0].trim();

    const vShort = clean.match(/^(?:Vivo\s+)?(Y\d+|V\d+e|V\d+|X\d+|S\d+|T\d+)/i);
    if (vShort) return 'Vivo ' + vShort[1].trim();
  }

  // 6. Oppo
  if (brand.includes('oppo') || /oppo/i.test(clean)) {
    const o = clean.match(/(OPPO\s+(?:Find\s+N\d+|Find\s+X\d+\s+Pro|Find\s+X\d+|Reno\s+\d+C|Reno\s+\d+\s+Pro\+|Reno\s+\d+\s+Pro|Reno\s+\d+|F\d+\s*Pro\+|F\d+\s*Pro|F\d+|A\d+\s*Pro|A\d+x|A\d+s|A\d+|K\d+x|K\d+))/i);
    if (o) return o[0].trim();
  }

  // 7. Redmi
  if (brand.includes('redmi') || brand.includes('xiaomi') || /redmi/i.test(clean)) {
    const rd = clean.match(/(Redmi\s+(?:Note\s+\d+\s*Pro\+|Note\s+\d+\s*Pro|Note\s+\d+|15A|17|\w+))/i);
    if (rd) return rd[0].trim();
  }

  // 8. Motorola
  if (brand.includes('motorola') || /moto/i.test(clean)) {
    const mo = clean.match(/(Motorola\s+(?:Razr\s+\d+\s+Ultra|Razr\s+\d+|Edge\s+\d+\s+Ultra|Edge\s+\d+\s+Pro|Edge\s+\d+|G\d+))/i);
    if (mo) return mo[0].trim();
  }

  // Fallback: strip storage, RAM, parentheses, display sizes, and connectivity labels
  return clean
    .replace(/\([^)]*\)/g, '')
    .replace(/\b\d+\s*(?:GB|TB|MB)\b/gi, '')
    .replace(/\b\d+\s*(?:GB|MB)\s*RAM\b/gi, '')
    .replace(/\b\d+(?:\.\d+)?\s*cm\s*Display\b/gi, '')
    .replace(/\b5G\s*Mobile\s*Phone\b/gi, '')
    .replace(/\bwith\s+Camera\s+Control\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Filters and groups a list of products model-wise.
 * Collapses variants into ONE representative card per phone/device model.
 * Each representative card is enriched with `_modelSiblings` containing all available storage tiers,
 * allowing instant switching and dynamic pricing right on the product card.
 */
export function getModelWiseProducts(productsList = []) {
  if (!Array.isArray(productsList) || productsList.length === 0) return [];

  const groups = new Map();

  for (const product of productsList) {
    if (!product) continue;
    const model = extractModelFamily(product);
    const brand = (product.brand || '').toLowerCase().trim();
    const key = `${brand}:${model.toLowerCase().trim()}`;

    if (!groups.has(key)) {
      groups.set(key, { modelName: model, items: [] });
    }
    groups.get(key).items.push(product);
  }

  const results = [];

  for (const [, { modelName, items }] of groups.entries()) {
    // Standardize storage and label for each sibling (supports both sibling products and embedded variants)
    const itemVariants = [];
    for (const item of items) {
      if (Array.isArray(item.variants) && item.variants.length > 0) {
        for (const v of item.variants) {
          const vStor = v.storage || extractStorageFromText(v.name || item.name) || extractStorageFromText(v.sku || item.sku) || '';
          const vRam = v.ram || item.ram || '';
          let label = v.variantLabel;
          if (!label) {
            if (vRam && vStor) {
              label = `${vRam}+${vStor}`.replace(/\s+/g, '');
            } else {
              label = vStor || 'Standard';
            }
          }
          itemVariants.push({
            ...item,
            ...v,
            id: v.id || `${item.id}-${vStor || label}`,
            storage: vStor,
            ram: vRam,
            variantLabel: label,
            salePrice: Number(v.salePrice || v.price || item.salePrice || item.price || 0),
            price: Number(v.price || item.price || 0),
            images: (v.images && v.images.length > 0) ? v.images : item.images
          });
        }
      } else {
        const stor = item.storage || extractStorageFromText(item.name) || extractStorageFromText(item.sku) || '';
        let label = item.variantLabel;
        if (!label) {
          if (item.ram && stor) {
            label = `${item.ram}+${stor}`.replace(/\s+/g, '');
          } else {
            label = stor || 'Standard';
          }
        }
        itemVariants.push({
          ...item,
          storage: stor,
          variantLabel: label,
          salePrice: Number(item.salePrice || item.price || 0),
          price: Number(item.price || 0)
        });
      }
    }

    // Deduplicate variants by RAM+Storage or variantLabel (preserving all distinct configurations)
    const storageMap = new Map();
    for (const v of itemVariants) {
      const sKey = (v.variantLabel || v.storage || v.id).toUpperCase().replace(/\s+/g, '');
      if (!storageMap.has(sKey)) {
        storageMap.set(sKey, v);
      } else {
        const existing = storageMap.get(sKey);
        if (v.salePrice < existing.salePrice) {
          storageMap.set(sKey, v);
        }
      }
    }

    let distinctVariants = Array.from(storageMap.values()).sort((a, b) => {
      const capA = parseStorageCapacity(a.storage || a.variantLabel);
      const capB = parseStorageCapacity(b.storage || b.variantLabel);
      if (capA > 0 && capB > 0 && capA !== capB) return capA - capB;
      const ramA = parseFloat(String(a.ram || a.variantLabel || '').replace(/[^0-9.]/g, '')) || 0;
      const ramB = parseFloat(String(b.ram || b.variantLabel || '').replace(/[^0-9.]/g, '')) || 0;
      if (ramA > 0 && ramB > 0 && ramA !== ramB) return ramA - ramB;
      return a.salePrice - b.salePrice;
    });

    const rep = distinctVariants[0];
    const isPhone = (rep.category || '').toLowerCase() === 'smartphones' || /iphone|galaxy|phone|fold/i.test(rep.name);

    // If only 1 storage option exists for a smartphone, synthesize logical storage tiers
    if (isPhone && distinctVariants.length === 1) {
      const curCap = parseStorageCapacity(rep.storage || extractStorageFromText(rep.name));
      const baseSale = rep.salePrice || rep.price;
      const baseMRP = rep.price;

      if (curCap === 64) {
        distinctVariants = [
          { ...rep, storage: '64GB', variantLabel: '64GB' },
          { ...rep, id: `${rep.id}-128`, storage: '128GB', variantLabel: '128GB', price: Math.round(baseMRP * 1.18), salePrice: Math.round(baseSale + 3000) }
        ];
      } else if (curCap === 128 || (!curCap && baseSale < 70000)) {
        distinctVariants = [
          { ...rep, storage: '128GB', variantLabel: '128GB' },
          { ...rep, id: `${rep.id}-256`, storage: '256GB', variantLabel: '256GB', price: Math.round(baseMRP * 1.15), salePrice: Math.round(baseSale + (baseSale > 50000 ? 10000 : 5000)) },
          { ...rep, id: `${rep.id}-512`, storage: '512GB', variantLabel: '512GB', price: Math.round(baseMRP * 1.35), salePrice: Math.round(baseSale + (baseSale > 50000 ? 25000 : 12000)) }
        ];
      } else if (curCap === 256 || (!curCap && baseSale >= 70000 && baseSale < 140000)) {
        distinctVariants = [
          { ...rep, id: `${rep.id}-128`, storage: '128GB', variantLabel: '128GB', price: Math.round(baseMRP * 0.9), salePrice: Math.max(1000, Math.round(baseSale - (baseSale > 80000 ? 15000 : 6000))) },
          { ...rep, storage: '256GB', variantLabel: '256GB' },
          { ...rep, id: `${rep.id}-512`, storage: '512GB', variantLabel: '512GB', price: Math.round(baseMRP * 1.15), salePrice: Math.round(baseSale + (baseSale > 80000 ? 20000 : 8000)) }
        ];
      } else if (curCap === 512 || (!curCap && baseSale >= 140000)) {
        distinctVariants = [
          { ...rep, id: `${rep.id}-256`, storage: '256GB', variantLabel: '256GB', price: Math.round(baseMRP * 0.88), salePrice: Math.max(1000, Math.round(baseSale - (baseSale > 60000 ? 15000 : 8000))) },
          { ...rep, storage: '512GB', variantLabel: '512GB' },
          { ...rep, id: `${rep.id}-1tb`, storage: '1TB', variantLabel: '1TB', price: Math.round(baseMRP * 1.2), salePrice: Math.round(baseSale + (baseSale > 60000 ? 25000 : 14000)) }
        ];
      }
    }

    // Always sort variants: lowest storage to highest storage
    distinctVariants.sort((a, b) => {
      const capA = parseStorageCapacity(a.storage || a.variantLabel);
      const capB = parseStorageCapacity(b.storage || b.variantLabel);
      if (capA > 0 && capB > 0 && capA !== capB) return capA - capB;
      return a.salePrice - b.salePrice;
    });

    const baseRep = distinctVariants[0];

    results.push({
      ...baseRep,
      modelGroup: modelName,
      _modelSiblings: distinctVariants
    });
  }

  return results;
}
