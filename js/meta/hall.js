// DOM overlay that lists the top runs. Injected once, shown via showHall().
function ensureHallDom() {
  if (document.getElementById('hall-overlay')) return;
  const d = document.createElement('div');
  d.id = 'hall-overlay';
  d.className = 'hidden';
  d.innerHTML = `
    <div id="hall-box">
      <h2>Hall of Renown</h2>
      <ol id="hall-list"></ol>
      <div id="class-row">
        <span>Class:</span>
        <button data-cls="ranger">Ranger</button>
        <button data-cls="rohirrim" data-lock="rohirrim">Rohirrim</button>
        <button data-cls="hobbit" data-lock="hobbit">Hobbit</button>
      </div>
      <button id="hall-close">Close</button>
    </div>`;
  document.body.appendChild(d);
  d.querySelector('#hall-close').addEventListener('click', () => d.classList.add('hidden'));
  d.querySelectorAll('#class-row button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cls;
      const lock = btn.dataset.lock;
      if (lock && state.meta.profile && !state.meta.profile.unlocks[lock]) {
        toast('Locked. Earn ' + (lock === 'rohirrim' ? 1000 : 3000) + ' Renown in a run.', 3);
        return;
      }
      state.meta.classChoice = key;
      state.meta.profile.classChoice = key;
      persistProfile();
      toast('Class: ' + CLASSES[key].name, 2);
    });
  });
}

function showHall() {
  ensureHallDom();
  const list = document.getElementById('hall-list');
  const prof = state.meta.profile;
  list.innerHTML = '';
  if (!prof || !prof.hall.length) {
    list.innerHTML = '<li><em>No fallen yet.</em></li>';
  } else {
    for (const run of prof.hall) {
      const li = document.createElement('li');
      li.textContent = `${(CLASSES[run.cls]||{name:run.cls}).name}: ${run.renown} Renown, ${run.gold} gold`;
      list.appendChild(li);
    }
  }
  document.getElementById('hall-overlay').classList.remove('hidden');
}
