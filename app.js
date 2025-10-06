// Wrapped to ensure the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
// Local Gem demo interactivity
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

const intro = qs('#intro');
const dashboard = qs('#dashboard');
const loginBtn = qs('#loginBtn');
const signupBtn = qs('#signupBtn');
const logoutBtn = qs('#logoutBtn');
const goBtn = qs('#goBtn');
const cardsEl = qs('#cards');

// proceed to app from intro (no real auth in demo)
function goToApp(){
  // Hide intro, show dashboard, and force scroll to top.
  intro.classList.remove('active');
  dashboard.classList.add('active');
  intro.style.display = 'none';
  dashboard.style.display = 'block';
  if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  window.scrollTo(0, 0);
}
loginBtn.addEventListener('click', goToApp);
signupBtn.addEventListener('click', goToApp);
logoutBtn.addEventListener('click', () => {
  dashboard.classList.remove('active');
  intro.classList.add('active');
});

// build 10 placeholder cards after entering a city
goBtn.addEventListener('click', () => {
  const city = qs('#city').value.trim() || 'Your City';
  renderCards(city);
  });


function renderCards(city){
  cardsEl.innerHTML = '';
  const c = (city && city.trim()) ? city.trim() : 'Your City';
  const places = Array.from({length:10}).map((_,i)=> ({
    name: `Placeholder Spot #${i+1}`,
    desc: `Short description for a cool place in ${c}.`,
    hood: `Neighborhood ${(i%5)+1}`,
    link: `https://www.google.com/maps?q=${encodeURIComponent(c)}+place+${i+1}`
  }));

  places.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0; // enable keyboard focus

    cardsEl.appendChild(card);
  });

  // Delegate vote clicks; keep it simple (log to console)
  const clickOnce = (e) => {
    const btn = e.target.closest('.btn[data-vote]');
    if(!btn) return;
    const card = btn.closest('.card');
    const name = card?.querySelector('h3')?.textContent || 'this place';
    const v = btn.dataset.vote;
    console.log(`Voted ${v} on ${name}`);
  };
  // remove previous to avoid stacking
  cardsEl.replaceWith(cardsEl.cloneNode(true));
  // re-select and repopulate (since we replaced)
  const fresh = document.querySelector('#cards');
  fresh.innerHTML = document.querySelector('#cards') ? fresh.innerHTML : '';
  // Rebuild cards again quickly (since we replaced node)
  fresh.innerHTML = document.querySelectorAll('.card').length ? fresh.innerHTML : document.querySelector('#cards')?.innerHTML;

  // Simpler: just re-render and reattach handler
  fresh.innerHTML = '';
  places.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="flip">
        <div class="face front">
          <div>
            <h3>${p.name}</h3>
            <div class="meta">${p.hood}</div>
          </div>
          <div class="link"><a href="${p.link}" target="_blank" rel="noopener">Open in Google Maps →</a></div>
        </div>
        <div class="face back">
          <div>
            <h3>${p.name}</h3>
            <p>Have you visited? Give a rating:</p>
          </div>
          <div class="vote">
            <button class="btn" data-vote="up" aria-label="Thumbs up">👍</button>
            <button class="btn" data-vote="down" aria-label="Thumbs down">👎</button>
          </div>
          <div class="link"><a href="${p.link}" target="_blank" rel="noopener">Open in Google Maps →</a></div>
        </div>
      </div>`;
    fresh.appendChild(card);
  });
  fresh.addEventListener('click', clickOnce, { once: true });
}


// Modal logic
const modal = qs('#voteModal');
const closeModalBtn = qs('#closeModal');
qsa('.btn.thumbs', modal).forEach(btn => {
  btn.addEventListener('click', () => {
    const vote = btn.dataset.vote;
    console.log('Vote:', vote, 'on current place'); // demo only
    modal.hidden = true;
  });
});
closeModalBtn.addEventListener('click', () => modal.hidden = true);

function openVoteModal(place){
  qs('#voteTitle').textContent = `Have you visited? Give a rating:?`;
  modal.hidden = false;
}

  // Also advance on Enter in password field
  const pwd = document.querySelector('#intro .auth input[type="password"]');
  if (pwd) pwd.addEventListener('keydown', (e) => { if (e.key === 'Enter') goToApp(); });
});


/* Event delegation backup for rating gem */
cardsEl.addEventListener('click', (e) => {
  const gem = e.target.closest('.corner-gem');
  if (gem) {
    const card = gem.closest('.card');
    const name = card?.querySelector('h3')?.textContent;
    openVoteModal({ name });
  }
});
