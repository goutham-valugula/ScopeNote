const ids = ['sender','client','project','scope','request','currency','fee','days','swapItem','laterDate','tone'];
const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const stateKey = 'scopenote-draft-v1';
let mode = 'add';
let toastTimer;

function escapeText(value) {
  return value.trim();
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '—';
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: fields.currency.value, maximumFractionDigits: 2 }).format(amount); }
  catch { return `${fields.currency.value} ${amount.toFixed(2)}`; }
}

function dayPhrase() {
  const days = Math.max(0, Math.floor(Number(fields.days.value) || 0));
  if (!days) return '';
  return `${days} working ${days === 1 ? 'day' : 'days'}`;
}

function buildNote() {
  const client = escapeText(fields.client.value) || 'there';
  const project = escapeText(fields.project.value) || 'the project';
  const scope = escapeText(fields.scope.value);
  const request = escapeText(fields.request.value);
  const sender = escapeText(fields.sender.value) || 'Your name';
  const fee = money(fields.fee.value);
  const days = dayPhrase();
  const swap = escapeText(fields.swapItem.value);
  const later = escapeText(fields.laterDate.value);
  const tone = fields.tone.value;
  const greeting = tone === 'formal' ? `Hello ${client},` : tone === 'concise' ? `Hi ${client},` : `Hi ${client},`;
  const intro = tone === 'formal' ? `Thanks for the note about ${project}.` : tone === 'concise' ? `Thanks for the new request on ${project}.` : `Thanks for sending this over for ${project} — happy to talk through it.`;
  let body = [];
  if (scope) body.push(`The current scope covers ${scope}.`);
  if (request) body.push(`The new request is: ${request}.`);
  if (mode === 'add') {
    const impact = [fee !== '—' ? `${fee} for the added work` : '', days ? `about ${days} of additional time` : ''].filter(Boolean).join(' and ');
    body.push(impact ? `I can add this to the project${impact ? `; the impact would be ${impact}` : ''}.` : 'I can add this to the project. We can agree the fee and timing before I begin.');
  } else if (mode === 'swap') {
    body.push(swap ? `To keep the project at its current budget and timing, we could swap this for ${swap}.` : 'We could keep the project at its current budget by swapping this for another item already in scope.');
  } else {
    body.push(later ? `We can keep the current plan as-is and revisit this ${later}.` : 'We can keep the current plan as-is and scope this as a possible next phase.');
  }
  const close = tone === 'formal' ? 'Please let me know which option you would prefer. I will wait for your confirmation before scheduling the additional work.' : tone === 'concise' ? 'Let me know which option works. I’ll wait for your go-ahead before starting.' : 'Let me know which option feels right. Once we’ve agreed the details, I’ll get it moving.';
  return `${greeting}\n\n${intro}\n\n${body.join('\n\n')}\n\n${close}\n\nThanks,\n${sender}`;
}

function saveDraft() {
  const draft = Object.fromEntries(ids.map(id => [id, fields[id].value]));
  draft.mode = mode;
  try { localStorage.setItem(stateKey, JSON.stringify(draft)); } catch { /* private browsing may block storage */ }
}

function update() {
  const note = buildNote();
  const project = escapeText(fields.project.value);
  const sender = escapeText(fields.sender.value);
  const request = escapeText(fields.request.value);
  document.getElementById('previewProject').textContent = project ? project.toUpperCase().slice(0, 34) : 'PROJECT NOTE';
  document.getElementById('previewTitle').textContent = request ? 'A quick note about the new request' : 'A quick note about the project';
  document.getElementById('previewText').textContent = note.split('\n\n').slice(0,-1).join('\n\n') || 'Add a client and describe the new request to see your note take shape here.';
  document.getElementById('previewSender').textContent = sender || 'Your name';
  document.getElementById('summaryFee').textContent = mode === 'add' ? money(fields.fee.value) : mode === 'swap' ? 'No change' : 'To discuss';
  document.getElementById('summaryDays').textContent = mode === 'add' ? (dayPhrase() || 'No change') : mode === 'swap' ? 'No change' : 'Later phase';
  document.getElementById('impactSummary').style.display = mode === 'later' ? 'none' : 'grid';
  document.getElementById('previewDate').textContent = new Intl.DateTimeFormat(undefined, { day:'2-digit', month:'short', year:'numeric' }).format(new Date()).toUpperCase();
  document.querySelector('.price-controls').classList.toggle('hidden', mode !== 'add');
  document.getElementById('swapWrap').classList.toggle('hidden', mode !== 'swap');
  document.getElementById('laterWrap').classList.toggle('hidden', mode !== 'later');
  document.getElementById('impactPanel').classList.toggle('later-mode', mode === 'later');
  saveDraft();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function restoreDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(stateKey) || 'null');
    if (!draft) return;
    for (const id of ids) if (typeof draft[id] === 'string') fields[id].value = draft[id];
    if (['add','swap','later'].includes(draft.mode)) mode = draft.mode;
  } catch { /* ignore damaged or unavailable local storage */ }
  document.querySelectorAll('.choice').forEach(button => button.classList.toggle('active', button.dataset.mode === mode));
}

ids.forEach(id => fields[id].addEventListener('input', update));
document.querySelectorAll('.choice').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.mode;
  document.querySelectorAll('.choice').forEach(item => item.classList.toggle('active', item === button));
  update();
}));
document.getElementById('copyBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(buildNote()); showToast('Client note copied. Give it a quick read before sending.'); }
  catch { showToast('Copy isn’t available here. Select the note and copy it instead.'); }
});
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Start a fresh note? This clears the draft saved in this browser.')) return;
  ids.forEach(id => { fields[id].value = ''; });
  fields.currency.value = 'USD'; fields.tone.value = 'warm'; mode = 'add';
  document.querySelectorAll('.choice').forEach(item => item.classList.toggle('active', item.dataset.mode === mode));
  try { localStorage.removeItem(stateKey); } catch { /* storage may be unavailable */ }
  update(); showToast('Fresh note ready.');
});
restoreDraft();
update();
