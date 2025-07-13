// js/gallery.js

// Dynamically populates the gallery with wood‑framed craft items
document.addEventListener('DOMContentLoaded', () => {
  const galleryEl = document.getElementById('gallery');
  if (!galleryEl) return;

  const crafts = [
    { src: 'images/craft1.jpg', title: 'Craft 1' },
    { src: 'images/craft2.jpg', title: 'Craft 2' },
    { src: 'images/craft3.jpg', title: 'Craft 3' },
    { src: 'images/craft4.jpg', title: 'Craft 4' }
  ];

  crafts.forEach(c => {
    // Create a frame for each craft
    const frame = document.createElement('figure');
    frame.className = 'showcase-frame';
    frame.innerHTML = `
      <img src="${c.src}" alt="${c.title}" loading="lazy" />
      <figcaption>${c.title}</figcaption>
    `;

    galleryEl.appendChild(frame);
  });
});
