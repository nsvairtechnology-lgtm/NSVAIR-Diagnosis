const fs = require('fs');

console.log('Testing node environment and file paths...');

// Check if all essential files exist and are non-empty
const files = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/manifest.ts',
  'src/app/opengraph-image.tsx',
  'src/app/twitter-image.tsx',
  'src/app/store/page.tsx',
  'src/app/store/[slug]/page.tsx',
  'src/app/admin/page.tsx',
  'src/components/diagnosis/dashboard.tsx',
  'src/components/diagnosis/health-report.tsx',
  'src/components/diagnosis/result-view.tsx',
  'src/components/diagnosis/mobile-bottom-nav.tsx',
  'src/components/diagnosis/mobile-quick-actions.tsx',
  'src/components/auth/auth-modal.tsx',
  'src/components/store/store-front.tsx',
  'src/components/store/product-detail.tsx',
  'src/components/store/product-image.tsx',
  'src/components/store/cart-drawer.tsx',
  'src/components/admin/admin-dashboard.tsx',
  'src/lib/products-data.ts',
  'src/lib/cart-store.ts',
  'src/lib/auth-store.ts',
  'src/lib/admin-store.ts',
  'src/lib/diagnosis-store.ts',
  'src/lib/report-sharing.ts',
  'src/lib/pdf-generator.ts',
];

let allPassed = true;
files.forEach((f) => {
  if (!fs.existsSync(f)) {
    console.error(`❌ Missing file: ${f}`);
    allPassed = false;
  } else {
    const stat = fs.statSync(f);
    if (stat.size === 0) {
      console.error(`❌ Empty file: ${f}`);
      allPassed = false;
    } else {
      console.log(`✅ ${f} (${stat.size} bytes)`);
    }
  }
});

if (allPassed) {
  console.log('\n🎉 ALL 28 CORE PROJECT FILES EXIST AND ARE POPULATED!');
} else {
  process.exit(1);
}
