// Populate gallery in rows of 2 with partition
document.addEventListener('DOMContentLoaded', () => {
  const galleryEl = document.getElementById('gallery');
  if (!galleryEl) return;

  const crafts = [
    { src: 'images/craft1.jpg', title: 'Craft 1' },
    { src: 'images/craft2.jpg', title: 'Craft 2' },
    { src: 'images/craft3.jpg', title: 'Craft 3' },
    { src: 'images/craft4.jpg', title: 'Craft 4' }
  ];

  for (let i = 0; i < crafts.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'showcase-row';
    crafts.slice(i, i + 2).forEach(c => {
      const fig = document.createElement('figure');
      fig.innerHTML = `
        <img src="${c.src}" alt="${c.title}" loading="lazy" />
        <figcaption>${c.title}</figcaption>
      `;
      row.appendChild(fig);
    });
    galleryEl.appendChild(row);
  }
});