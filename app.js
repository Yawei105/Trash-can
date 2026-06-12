const ICONS = {
  fpv: `<svg viewBox="0 0 120 120" class="product-icon"><g fill="none" stroke="currentColor" stroke-width="2"><line x1="60" y1="60" x2="20" y2="20"/><line x1="60" y1="60" x2="100" y2="20"/><line x1="60" y1="60" x2="20" y2="100"/><line x1="60" y1="60" x2="100" y2="100"/><circle cx="20" cy="20" r="12"/><circle cx="100" cy="20" r="12"/><circle cx="20" cy="100" r="12"/><circle cx="100" cy="100" r="12"/><rect x="48" y="48" width="24" height="24" rx="3" fill="currentColor" opacity=".2"/></g></svg>`,
  quad: `<svg viewBox="0 0 120 120" class="product-icon"><g fill="none" stroke="currentColor" stroke-width="2"><line x1="60" y1="60" x2="15" y2="15"/><line x1="60" y1="60" x2="105" y2="15"/><line x1="60" y1="60" x2="15" y2="105"/><line x1="60" y1="60" x2="105" y2="105"/><circle cx="15" cy="15" r="16"/><circle cx="105" cy="15" r="16"/><circle cx="15" cy="105" r="16"/><circle cx="105" cy="105" r="16"/><rect x="45" y="45" width="30" height="30" rx="4" fill="currentColor" opacity=".2"/><circle cx="60" cy="60" r="6" fill="currentColor" opacity=".4"/></g></svg>`,
  wing: `<svg viewBox="0 0 120 120" class="product-icon"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M10,65 L60,55 L110,65 L60,75 Z" fill="currentColor" opacity=".15"/><path d="M55,55 L60,20 L65,55"/><path d="M50,75 L60,95 L70,75"/><line x1="60" y1="55" x2="60" y2="75"/></g></svg>`,
};

function formatPrice(n) {
  return '¥' + n.toLocaleString('zh-CN');
}

function specLabel(key) {
  const labels = { '轴距': '轴距', '翼展': '翼展', '空载重量': '空载重量', '最大载重': '最大载重', '续航时间': '续航', '最大速度': '最大速度' };
  return labels[key] || key;
}

async function loadProducts() {
  if (window.PRODUCTS) return window.PRODUCTS;
  const res = await fetch('products.json');
  return res.json();
}

async function init() {
  const products = await loadProducts();

  // Hero stats
  const prices = products.map(p => p.price);
  document.getElementById('hero-stats').innerHTML = `
    <div class="stat-item"><div class="stat-num">${products.length}</div><div class="stat-label">产品型号</div></div>
    <div class="stat-item"><div class="stat-num">3</div><div class="stat-label">产品类别</div></div>
    <div class="stat-item"><div class="stat-num">${formatPrice(Math.min(...prices))}</div><div class="stat-label">起步价格</div></div>
  `;

  // Nav links
  document.getElementById('nav-links').innerHTML = products
    .map(p => `<a href="#${p.id}">${p.name}</a>`)
    .join('');

  // Overview cards
  document.getElementById('overview-grid').innerHTML = products.map(p => {
    const specEntries = Object.entries(p.specs).slice(0, 4);
    return `
      <a class="overview-card" href="#${p.id}">
        <div class="card-top">
          <span class="card-category">${p.category}</span>
          <div class="card-price">${formatPrice(p.price)}</div>
        </div>
        <h3>${p.name}</h3>
        <p class="card-tagline">${p.tagline}</p>
        <div class="card-specs">
          ${specEntries.map(([k, v]) => `
            <div class="card-spec"><strong>${v}</strong>${specLabel(k)}</div>
          `).join('')}
        </div>
      </a>`;
  }).join('');

  // Compare table
  const specKeys = ['price', ...new Set(products.flatMap(p => Object.keys(p.specs)))];
  const specLabels = { price: '参考报价', ...Object.fromEntries(products.flatMap(p => Object.keys(p.specs)).map(k => [k, specLabel(k)])) };

  document.getElementById('compare-table').innerHTML = `
    <thead><tr>
      <th>参数</th>
      ${products.map(p => `<th>${p.name.replace(' · ', '<br>')}</th>`).join('')}
    </tr></thead>
    <tbody>
      ${specKeys.map(key => `
        <tr>
          <td>${specLabels[key] || key}</td>
          ${products.map(p => {
            if (key === 'price') return `<td class="price-cell">${formatPrice(p.price)}</td>`;
            return `<td>${p.specs[key] || '—'}</td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>`;

  // Product detail sections
  document.getElementById('products-container').innerHTML = products.map((p, i) => `
    <section class="product-section" id="${p.id}">
      <div class="container">
        <div style="text-align:center">${ICONS[p.icon] || ICONS.quad}</div>
        <div class="product-header">
          <div class="product-header-left">
            <span class="card-category">${p.category}</span>
            <h2>${p.name}</h2>
            <p class="tagline">${p.tagline}</p>
          </div>
          <div class="product-header-right">
            <div class="product-price-big">${formatPrice(p.price)}</div>
            ${p.priceNote ? `<div class="product-price-note">${p.priceNote}</div>` : ''}
          </div>
        </div>
        <div class="product-body">
          <div class="product-specs-panel">
            <div class="panel-title">性能参数</div>
            <ul class="spec-list">
              ${Object.entries(p.specs).map(([k, v]) => `
                <li><span class="spec-key">${specLabel(k)}</span><span class="spec-val">${v}</span></li>
              `).join('')}
            </ul>
            <div class="highlights">
              ${p.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
            </div>
          </div>
          <div class="product-components-panel">
            <div class="panel-title">配置清单</div>
            <ul class="component-list">
              ${p.components.map(c => `
                <li><span class="comp-name">${c.name}</span><span class="comp-note">${c.note}</span></li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `).join('');

  // Mobile nav toggle
  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });
}

init().catch(console.error);
