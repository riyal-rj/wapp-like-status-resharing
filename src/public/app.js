const api = {
  postStatus: '/postStatus',
  checkStatus: (userId) => `/checkStatus/${encodeURIComponent(userId)}`,
  reshareStatus: '/reshareStatus'
};
api.deleteStatus = '/deleteStatus';
api.viewers = (userId) => `/viewers/${encodeURIComponent(userId)}`;

const qs = (sel) => document.querySelector(sel);

// Post status
qs('#post-btn').addEventListener('click', async () => {
  const userId = qs('#post-user').value.trim();
  const content = qs('#post-content').value.trim();
  const out = qs('#post-result');
  out.textContent = '';
  if (!userId || !content) return out.textContent = 'Please provide a user id and content.';

  try {
    const res = await fetch(api.postStatus, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ userId, content })
    });
    const data = await res.json();
    out.textContent = data.message + (data.timestamp ? ` (ts: ${new Date(data.timestamp).toLocaleTimeString()})` : '');
    appendFeedItem(userId, content, data.timestamp || Date.now());
  } catch (err) {
    out.textContent = 'Network error';
  }
});

// Check status
qs('#check-btn').addEventListener('click', async () => {
  const userId = qs('#check-user').value.trim();
  const out = qs('#check-result');
  out.textContent = '';
  if (!userId) return out.textContent = 'Please provide a user id.';

  try {
    // include session user as viewer if set
    const session = qs('#session-display').dataset.user;
    const url = session ? `${api.checkStatus(userId)}?viewerId=${encodeURIComponent(session)}` : api.checkStatus(userId);
    const res = await fetch(url);
    const data = await res.json();
    if (data.valid) {
      out.innerHTML = `<div class="meta">Valid</div><div class="content">${escapeHtml(data.content)}</div>`;
    } else {
      out.textContent = data.message || 'No status';
    }
  } catch (err) {
    out.textContent = 'Network error';
  }
});

// Reshare
qs('#reshare-btn').addEventListener('click', async () => {
  const originalUserId = qs('#orig-user').value.trim();
  const resharingUserId = qs('#reshare-user').value.trim();
  const out = qs('#reshare-result');
  out.textContent = '';
  if (!originalUserId || !resharingUserId) return out.textContent = 'Please fill both fields.';

  try {
    const res = await fetch(api.reshareStatus, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ originalUserId, resharingUserId })
    });
    const data = await res.json();
    out.textContent = data.message + (data.timestamp ? ` (ts: ${new Date(data.timestamp).toLocaleTimeString()})` : '');
    if (data.timestamp) {
      // show in local feed
      const contentRes = await fetch(api.checkStatus(resharingUserId));
      const contentData = await contentRes.json();
      if (contentData.valid) appendFeedItem(resharingUserId, contentData.content, data.timestamp);
    }
  } catch (err) {
    out.textContent = 'Network error';
  }
});

// Session user
qs('#set-session').addEventListener('click', () => {
  const id = qs('#session-user').value.trim();
  qs('#session-display').textContent = id ? `session: ${id}` : '';
  if (id) qs('#session-display').dataset.user = id; else delete qs('#session-display').dataset.user;
});

// Feed helpers
function appendFeedItem(userId, content, ts) {
  const feed = qs('#feed');
  const item = document.createElement('div');
  item.className = 'feed-item';
  item.innerHTML = `<div class="meta">${escapeHtml(userId)} • ${new Date(ts).toLocaleTimeString()}</div><div class="content">${escapeHtml(content)}</div>
    <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
      <button class="btn-viewers" data-user="${escapeHtml(userId)}">Viewers</button>
      <button class="btn-delete" data-user="${escapeHtml(userId)}">Delete</button>
    </div>`;
  feed.prepend(item);

  // attach handlers
  item.querySelector('.btn-viewers').addEventListener('click', async (e) => {
    const uid = e.target.dataset.user;
    const res = await fetch(api.viewers(uid));
    const data = await res.json();
    alert(`Viewers for ${uid}:\n${data.viewers.join('\n') || '(none)'}`);
  });

  item.querySelector('.btn-delete').addEventListener('click', async (e) => {
    const uid = e.target.dataset.user;
    const session = qs('#session-display').dataset.user;
    if (!session || session !== uid) return alert('You can only delete your own status (set session user to owner).');
    const res = await fetch(api.deleteStatus, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid }) });
    const data = await res.json();
    alert(data.message);
    // remove from local feed view
    item.remove();
  });
}

qs('#refresh-feed').addEventListener('click', () => {
  // For demo purposes, local feed is client side only
  const feed = qs('#feed');
  if (!feed.children.length) feed.innerHTML = '<div class="result">No local statuses yet. Post or reshare to see them.</div>';
});

// Show viewers panel
qs('#show-viewers').addEventListener('click', async () => {
  const userId = qs('#viewers-user').value.trim();
  const out = qs('#viewers-result');
  out.textContent = '';
  if (!userId) return out.textContent = 'Provide a user id';
  try {
    const res = await fetch(api.viewers(userId));
    const data = await res.json();
    out.textContent = data.viewers.length ? data.viewers.join(', ') : '(none)';
  } catch (err) {
    out.textContent = 'Network error';
  }
});

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
}

// Initial message
document.addEventListener('DOMContentLoaded', () => {
  qs('#feed').innerHTML = '<div class="result">No local statuses yet. Post or reshare to see them.</div>';
});