const fastGlob = require('fast-glob');
const fs = require('fs');

(async () => {
  const files = await fastGlob([
    'my-mall-app/**/*.{ts,tsx,js,jsx,css,json,html}',
    '*.{ts,tsx,js,jsx,css,json,html}',

    // Hariç tutulanlar
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/public/**',
    '!**/screenshots/**',
    '!**/*.map',
    '!**/*.min.*',
    '!**/build/**',
    '!**/dist/**',
    '!**/*.png',
    '!**/*.jpg',
    '!**/*.jpeg',
    '!**/*.svg',
    '!**/*.ico',
    '!**/*.webp',
    '!**/*.mp4',
    '!**/*.gif',
    '!**/*.ttf',
    '!**/*.woff',
    '!**/*.woff2',
    '!**/*.eot',
    '!**/*.otf',
    '!**/*.zip',
    '!**/*.rar',
    '!**/*.pdf',
  ]);

  let result = '';

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      result += `
===============================
📄 Dosya: ${file}
===============================
${content}

`;
    } catch (err) {
      console.warn(`⛔ Dosya okunamadı: ${file}`);
    }
  }

  fs.writeFileSync('grupno_kaynakkod.txt', result);
  console.log('✅ grupno_kaynakkod.txt başarıyla ve temiz şekilde oluşturuldu.');
})();
