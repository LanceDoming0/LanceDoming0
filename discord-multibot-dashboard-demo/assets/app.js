(() => {
  'use strict';

  const bots = [
    { name: 'Information Bot', icon: '💙', status: 'running', commands: 14 },
    { name: 'Logs Bot', icon: '📜', status: 'running', commands: 8 },
    { name: 'Role Bot', icon: '🧩', status: 'stopped', commands: 11 },
    { name: 'Security Bot', icon: '🛡️', status: 'running', commands: 17 },
    { name: 'Sticky Bot', icon: '📌', status: 'stopped', commands: 6 },
    { name: 'Timesheet Bot', icon: '⏱️', status: 'running', commands: 9 },
    { name: 'Whitelist Bot', icon: '✅', status: 'running', commands: 12 }
  ];

  const securityModules = [
    ['Anti-nuke', 'Blocks destructive server actions'],
    ['Anti-raid', 'Detects unusual member join waves'],
    ['Anti-spam', 'Limits repeated messages and floods'],
    ['Role protection', 'Watches role creation and deletion'],
    ['Webhook protection', 'Monitors suspicious webhook activity'],
    ['Server lockdown', 'Restricts activity during emergencies']
  ];

  const activity = [];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  function addLog(message, type = 'info') {
    activity.unshift({ message, type, stamp: time() });
    if (activity.length > 30) activity.pop();
    renderActivity();
  }

  function renderStats() {
    const running = bots.filter(bot => bot.status === 'running').length;
    const commandCount = bots.reduce((sum, bot) => sum + bot.commands, 0);
    $('#statsGrid').innerHTML = [
      ['Bots online', running],
      ['Bots offline', bots.length - running],
      ['Registered commands', commandCount],
      ['Security modules', securityModules.length]
    ].map(([label, value]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span></article>`).join('');
  }

  function renderBots() {
    $('#botGrid').innerHTML = bots.map((bot, index) => `
      <article class="bot-card">
        <div class="bot-head">
          <div class="bot-icon">${bot.icon}</div>
          <span class="bot-status ${bot.status}">${bot.status.toUpperCase()}</span>
        </div>
        <h3>${bot.name}</h3>
        <p>${bot.commands} registered demo commands · Mock process status</p>
        <div class="bot-actions">
          <button class="success" data-action="start" data-index="${index}">Start</button>
          <button class="danger" data-action="stop" data-index="${index}">Stop</button>
          <button class="warning" data-action="restart" data-index="${index}">Restart</button>
        </div>
      </article>
    `).join('');

    $$('.bot-actions button').forEach(button => button.addEventListener('click', () => {
      const bot = bots[Number(button.dataset.index)];
      const action = button.dataset.action;
      if (action === 'start') bot.status = 'running';
      if (action === 'stop') bot.status = 'stopped';
      if (action === 'restart') bot.status = 'running';
      addLog(`${bot.name}: ${action} command simulated`, action === 'stop' ? 'warn' : 'info');
      renderAll();
    }));
  }

  function renderMiniList() {
    $('#miniBotList').innerHTML = bots.map(bot => `<div class="mini-item"><strong>${bot.icon} ${bot.name}</strong><span>${bot.status}</span></div>`).join('');
  }

  function renderSecurity() {
    $('#securityGrid').innerHTML = securityModules.map(([name, description], index) => `
      <article class="security-card">
        <div><strong>${name}</strong><p>${description}</p></div>
        <input class="switch" type="checkbox" ${index < 4 ? 'checked' : ''} aria-label="Toggle ${name}" data-name="${name}">
      </article>
    `).join('');
    $$('.switch').forEach(toggle => toggle.addEventListener('change', () => addLog(`${toggle.dataset.name} ${toggle.checked ? 'enabled' : 'disabled'}`, toggle.checked ? 'info' : 'warn')));
  }

  function renderActivity() {
    const items = activity.slice(0, 6);
    $('#activityList').innerHTML = items.length ? items.map(item => `<li>${item.stamp} — ${item.message}</li>`).join('') : '<li>No activity recorded yet.</li>';
    $('#logConsole').innerHTML = activity.length ? activity.map(item => `<div class="log-line ${item.type}"><time>${item.stamp}</time>${item.message}</div>`).join('') : '<div class="log-line">Waiting for a simulated control action...</div>';
  }

  function renderAll() {
    renderStats();
    renderBots();
    renderMiniList();
    renderActivity();
  }

  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    $$('.nav-link').forEach(item => item.classList.remove('active'));
    $$('.view').forEach(view => view.classList.remove('active'));
    link.classList.add('active');
    $(`#${link.dataset.view}`).classList.add('active');
    $('#sidebar').classList.remove('open');
  }));

  $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#clearLog').addEventListener('click', () => { activity.length = 0; renderActivity(); });
  $('#exportLog').addEventListener('click', () => {
    const contents = activity.map(item => `[${item.stamp}] ${item.message}`).join('\n') || 'No activity recorded.';
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lance-dashboard-demo-log.txt';
    link.click();
    URL.revokeObjectURL(url);
  });

  $$('[data-global]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.global;
    bots.forEach(bot => bot.status = action === 'stop' ? 'stopped' : 'running');
    addLog(`Global ${action} command simulated for ${bots.length} bots`, action === 'stop' ? 'warn' : 'info');
    renderAll();
  }));

  setInterval(() => $('#clock').textContent = time(), 1000);
  addLog('Dashboard demo initialized');
  renderSecurity();
  renderAll();
})();
