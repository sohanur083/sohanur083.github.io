// ===== Interactive widgets for blog posts =====

// ---------- PERCEPTRON (AI post) ----------
window.initPerceptron = function () {
  const canvas = document.getElementById('perceptron-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w1El = document.getElementById('w1');
  const w2El = document.getElementById('w2');
  const bEl  = document.getElementById('bias');
  const w1Out = document.getElementById('w1-val');
  const w2Out = document.getElementById('w2-val');
  const bOut  = document.getElementById('bias-val');
  const resetBtn = document.getElementById('reset-perceptron');

  // Fit canvas
  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 320 * dpr;
    canvas.style.height = '320px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: 320 };
  }

  // Sample points (two classes)
  let points = [
    { x: -0.5, y:  0.4, c: 0 }, { x: -0.3, y:  0.6, c: 0 },
    { x: -0.7, y:  0.2, c: 0 }, { x: -0.4, y:  0.8, c: 0 },
    { x: -0.6, y:  0.5, c: 0 },
    { x:  0.5, y: -0.4, c: 1 }, { x:  0.3, y: -0.6, c: 1 },
    { x:  0.7, y: -0.2, c: 1 }, { x:  0.4, y: -0.8, c: 1 },
    { x:  0.6, y: -0.5, c: 1 }
  ];

  function render() {
    const { w, h } = sizeCanvas();
    ctx.clearRect(0, 0, w, h);

    const w1 = parseFloat(w1El.value);
    const w2 = parseFloat(w2El.value);
    const b  = parseFloat(bEl.value);

    w1Out.textContent = w1.toFixed(2);
    w2Out.textContent = w2.toFixed(2);
    bOut.textContent  = b.toFixed(2);

    // Map: x in [-1,1] -> [0,w], y in [-1,1] -> [h,0]
    const sx = x => (x + 1) / 2 * w;
    const sy = y => h - (y + 1) / 2 * h;

    // Decision surface (heatmap-ish)
    const step = 20;
    for (let px = 0; px < w; px += step) {
      for (let py = 0; py < h; py += step) {
        const x = (px / w) * 2 - 1;
        const y = 1 - (py / h) * 2;
        const z = w1 * x + w2 * y + b;
        const out = 1 / (1 + Math.exp(-z));
        const alpha = Math.abs(out - 0.5) * 0.8;
        ctx.fillStyle = out > 0.5
          ? `rgba(0, 212, 255, ${alpha})`
          : `rgba(255, 92, 172, ${alpha})`;
        ctx.fillRect(px, py, step, step);
      }
    }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.stroke();

    // Decision boundary: w1 x + w2 y + b = 0 → y = -(w1 x + b)/w2
    if (Math.abs(w2) > 0.01) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const x1 = -1, x2 = 1;
      const y1 = -(w1 * x1 + b) / w2;
      const y2 = -(w1 * x2 + b) / w2;
      ctx.moveTo(sx(x1), sy(y1));
      ctx.lineTo(sx(x2), sy(y2));
      ctx.stroke();
    }

    // Points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(sx(p.x), sy(p.y), 7, 0, Math.PI*2);
      ctx.fillStyle = p.c === 1 ? '#00d4ff' : '#ff5cac';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Accuracy
    let correct = 0;
    for (const p of points) {
      const z = w1*p.x + w2*p.y + b;
      const pred = z > 0 ? 1 : 0;
      if (pred === p.c) correct++;
    }
    const acc = (correct / points.length * 100).toFixed(0);
    document.getElementById('perceptron-acc').textContent = acc + '%';
  }

  [w1El, w2El, bEl].forEach(el => el.addEventListener('input', render));
  if (resetBtn) resetBtn.addEventListener('click', () => {
    w1El.value = 0.5; w2El.value = -0.5; bEl.value = 0;
    render();
  });
  window.addEventListener('resize', render);
  render();
};

// ---------- LINEAR REGRESSION (ML post) ----------
window.initRegression = function () {
  const canvas = document.getElementById('regression-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resetBtn = document.getElementById('reset-regression');
  const demoBtn = document.getElementById('demo-regression');

  let points = [];
  let m = 0, b = 0, mse = 0;

  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 320 * dpr;
    canvas.style.height = '320px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: 320 };
  }

  function fit() {
    if (points.length < 2) { m = 0; b = 0; return; }
    const n = points.length;
    const sx = points.reduce((s,p) => s+p.x, 0);
    const sy = points.reduce((s,p) => s+p.y, 0);
    const sxy = points.reduce((s,p) => s+p.x*p.y, 0);
    const sx2 = points.reduce((s,p) => s+p.x*p.x, 0);
    const denom = n*sx2 - sx*sx;
    if (Math.abs(denom) < 1e-9) return;
    m = (n*sxy - sx*sy) / denom;
    b = (sy - m*sx) / n;
    mse = points.reduce((s,p) => {
      const e = p.y - (m*p.x + b);
      return s + e*e;
    }, 0) / n;
  }

  function render() {
    const { w, h } = sizeCanvas();
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i*w/10, 0); ctx.lineTo(i*w/10, h);
      ctx.moveTo(0, i*h/10); ctx.lineTo(w, i*h/10);
      ctx.stroke();
    }

    // Line
    if (points.length >= 2) {
      fit();
      ctx.strokeStyle = '#7c5cff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const y1 = m * 0 + b;
      const y2 = m * w + b;
      ctx.moveTo(0, y1); ctx.lineTo(w, y2);
      ctx.stroke();

      // Error lines
      ctx.strokeStyle = 'rgba(255,92,172,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      for (const p of points) {
        const py = m * p.x + b;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, py);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Hint
    if (points.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '14px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('click anywhere to drop data points →', w/2, h/2);
    }

    document.getElementById('reg-slope').textContent = m.toFixed(3);
    document.getElementById('reg-intercept').textContent = b.toFixed(1);
    document.getElementById('reg-mse').textContent = mse.toFixed(1);
    document.getElementById('reg-count').textContent = points.length;
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    render();
  });
  if (resetBtn) resetBtn.addEventListener('click', () => { points = []; render(); });
  if (demoBtn) demoBtn.addEventListener('click', () => {
    const { w, h } = sizeCanvas();
    points = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * w;
      const y = 0.6 * x + (h * 0.2) + (Math.random() - 0.5) * 80;
      points.push({ x, y: Math.max(10, Math.min(h-10, y)) });
    }
    render();
  });
  window.addEventListener('resize', render);
  render();
};

// ---------- TOKENIZER (LLM post) ----------
window.initTokenizer = function () {
  const input = document.getElementById('tokenize-input');
  const output = document.getElementById('tokenize-output');
  const count = document.getElementById('token-count');
  if (!input) return;

  // Simple BPE-ish simulation: word + subword splits on common suffixes
  const suffixes = ['ing', 'ed', 'ly', 'tion', 'ness', 'er', 'est', 's', 'al'];
  const palette = [
    '#7c5cff', '#00d4ff', '#ff5cac', '#5ff08d',
    '#ffa84d', '#a78bfa', '#4dd0e1', '#ffb86c'
  ];

  function tokenize(text) {
    if (!text.trim()) return [];
    const tokens = [];
    const parts = text.split(/(\s+|[.,!?;:])/).filter(p => p.length);
    for (const p of parts) {
      if (/^\s+$/.test(p)) continue;
      if (/[.,!?;:]/.test(p)) { tokens.push(p); continue; }

      let word = p.toLowerCase();
      let piece = '';
      let matched = false;
      for (const s of suffixes) {
        if (word.length > s.length + 2 && word.endsWith(s)) {
          tokens.push(word.slice(0, -s.length));
          tokens.push('##' + s);
          matched = true;
          break;
        }
      }
      if (!matched) tokens.push(word);
    }
    return tokens;
  }

  function render() {
    const toks = tokenize(input.value);
    output.innerHTML = '';
    toks.forEach((t, i) => {
      const span = document.createElement('span');
      span.className = 'token';
      span.textContent = t;
      span.style.background = palette[i % palette.length];
      output.appendChild(span);
    });
    count.textContent = toks.length;
  }

  input.addEventListener('input', render);
  render();
};

// ---------- ATTENTION HEATMAP (LLM post) ----------
window.initAttention = function () {
  const canvas = document.getElementById('attention-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const words = ['The', 'doctor', 'said', 'the', 'patient', 'needs', 'rest'];

  // Fake attention matrix: each word attends to others with a plausible weight
  const att = [
    [0.5, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05],
    [0.1, 0.6, 0.1, 0.05, 0.1, 0.025, 0.025],
    [0.1, 0.25, 0.35, 0.05, 0.2, 0.025, 0.025],
    [0.1, 0.1, 0.05, 0.3, 0.4, 0.025, 0.025],
    [0.05, 0.3, 0.1, 0.2, 0.25, 0.05, 0.05],
    [0.05, 0.05, 0.05, 0.05, 0.4, 0.3, 0.1],
    [0.05, 0.05, 0.05, 0.05, 0.3, 0.2, 0.3]
  ];

  function render() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, 420);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = 90;
    const cell = (size - pad) / words.length;

    ctx.clearRect(0, 0, size, size);
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textBaseline = 'middle';

    // Row labels
    ctx.fillStyle = '#a0a3b0';
    ctx.textAlign = 'right';
    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], pad - 8, pad + i*cell + cell/2);
    }
    // Col labels (rotated)
    ctx.textAlign = 'left';
    for (let j = 0; j < words.length; j++) {
      ctx.save();
      ctx.translate(pad + j*cell + cell/2, pad - 8);
      ctx.rotate(-Math.PI/4);
      ctx.fillText(words[j], 0, 0);
      ctx.restore();
    }

    // Cells
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        const v = att[i][j];
        const alpha = Math.max(0.1, v * 2.2);
        ctx.fillStyle = `rgba(124, 92, 255, ${alpha})`;
        ctx.fillRect(pad + j*cell, pad + i*cell, cell-2, cell-2);

        ctx.fillStyle = v > 0.25 ? '#fff' : '#e8e9ee';
        ctx.textAlign = 'center';
        ctx.fillText(v.toFixed(2), pad + j*cell + cell/2, pad + i*cell + cell/2);
      }
    }
  }

  window.addEventListener('resize', render);
  render();
};

// ---------- SHAPLEY BARS (XAI post) ----------
window.initShapley = function () {
  const features = [
    { name: 'age', val: 55, min: 20, max: 80, weight: 0.015 },
    { name: 'blood pressure', val: 130, min: 80, max: 180, weight: 0.012 },
    { name: 'cholesterol', val: 210, min: 120, max: 320, weight: 0.008 },
    { name: 'glucose', val: 120, min: 70, max: 240, weight: 0.011 },
    { name: 'BMI', val: 28, min: 18, max: 45, weight: 0.035 },
    { name: 'smoker', val: 0, min: 0, max: 1, weight: 0.5 }
  ];

  const sliders = document.getElementById('shapley-sliders');
  const bars = document.getElementById('shapley-bars');
  const riskEl = document.getElementById('risk-score');
  if (!sliders) return;

  // Build sliders
  features.forEach((f, i) => {
    const wrap = document.createElement('label');
    wrap.innerHTML = `
      <span>${f.name} <em id="fv-${i}">${f.val}</em></span>
      <input type="range" min="${f.min}" max="${f.max}" step="${f.name==='smoker'?1:1}" value="${f.val}" data-i="${i}">
    `;
    sliders.appendChild(wrap);
  });

  function render() {
    // Shapley-like contribution: (val - baseline_mean) * weight
    const contribs = features.map(f => {
      const baseline = (f.min + f.max) / 2;
      return (f.val - baseline) * f.weight;
    });
    const total = contribs.reduce((s,v) => s+v, 0);
    const risk = Math.max(0, Math.min(100, 40 + total * 100));
    riskEl.textContent = risk.toFixed(0) + '%';
    riskEl.style.color = risk > 60 ? '#ff5cac' : risk > 40 ? '#ffa84d' : '#5ff08d';

    // Render bars (sorted by absolute contribution)
    const order = features
      .map((f, i) => ({ f, i, c: contribs[i] }))
      .sort((a, b) => Math.abs(b.c) - Math.abs(a.c));

    const maxAbs = Math.max(...contribs.map(Math.abs), 0.01);

    bars.innerHTML = '';
    for (const row of order) {
      const width = Math.abs(row.c) / maxAbs * 100;
      const div = document.createElement('div');
      div.className = 'bar-row';
      div.innerHTML = `
        <div class="bar-label">${row.f.name}</div>
        <div class="bar-track">
          <div class="bar-fill ${row.c < 0 ? 'neg' : ''}" style="width:${width}%"></div>
        </div>
        <div class="bar-value">${row.c > 0 ? '+' : ''}${row.c.toFixed(2)}</div>
      `;
      bars.appendChild(div);
    }
  }

  sliders.addEventListener('input', e => {
    if (e.target.type !== 'range') return;
    const i = parseInt(e.target.dataset.i);
    features[i].val = parseFloat(e.target.value);
    document.getElementById('fv-'+i).textContent = features[i].val;
    render();
  });
  render();
};

// ---------- MULTI-HEAD ATTENTION (Transformer post) ----------
window.initMultiHead = function () {
  const canvas = document.getElementById('multihead-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const headSel = document.getElementById('head-select');
  const headName = document.getElementById('head-name');
  const words = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'];

  // 4 different attention heads each learning different patterns
  function genHead(kind) {
    const n = words.length;
    const m = Array.from({length: n}, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let v = 0;
        if (kind === 0) v = i === j ? 0.8 : 0.02;           // identity
        else if (kind === 1) v = j === i-1 ? 0.7 : (j === i ? 0.2 : 0.01); // previous-word
        else if (kind === 2) v = Math.exp(-Math.abs(i-j)/2) * 0.5;         // local window
        else v = Math.random() * 0.3 + (j === n-1-i ? 0.4 : 0);            // long-range
        m[i][j] = v;
      }
      // normalise
      const s = m[i].reduce((a,b) => a+b, 0);
      for (let j = 0; j < n; j++) m[i][j] /= s;
    }
    return m;
  }
  const heads = [
    { name: 'Head 1 · Self-focus (diagonal)', m: genHead(0) },
    { name: 'Head 2 · Previous-word', m: genHead(1) },
    { name: 'Head 3 · Local window', m: genHead(2) },
    { name: 'Head 4 · Long-range', m: genHead(3) }
  ];

  let active = 0;

  function render() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, 460);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = 100;
    const cell = (size - pad - 10) / words.length;
    const m = heads[active].m;
    headName.textContent = heads[active].name;

    ctx.clearRect(0, 0, size, size);
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#a0a3b0';
    ctx.textAlign = 'right';
    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], pad - 8, pad + i*cell + cell/2);
    }
    ctx.textAlign = 'left';
    for (let j = 0; j < words.length; j++) {
      ctx.save();
      ctx.translate(pad + j*cell + cell/2, pad - 8);
      ctx.rotate(-Math.PI/4);
      ctx.fillText(words[j], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        const v = m[i][j];
        const alpha = Math.max(0.08, v * 2.5);
        const colors = [
          `rgba(124, 92, 255, ${alpha})`,
          `rgba(0, 212, 255, ${alpha})`,
          `rgba(95, 240, 141, ${alpha})`,
          `rgba(255, 92, 172, ${alpha})`
        ];
        ctx.fillStyle = colors[active];
        ctx.fillRect(pad + j*cell, pad + i*cell, cell-2, cell-2);

        ctx.fillStyle = v > 0.2 ? '#fff' : '#a0a3b0';
        ctx.textAlign = 'center';
        ctx.fillText(v.toFixed(2), pad + j*cell + cell/2, pad + i*cell + cell/2);
      }
    }
  }

  headSel.addEventListener('change', e => {
    active = parseInt(e.target.value);
    render();
  });
  window.addEventListener('resize', render);
  render();
};

// ---------- FINE-TUNE PARAM CALCULATOR ----------
window.initFTCalc = function () {
  const sizeSel = document.getElementById('ft-size');
  const methodSel = document.getElementById('ft-method');
  const rankSel = document.getElementById('ft-rank');
  const bitsSel = document.getElementById('ft-bits');

  const paramsOut = document.getElementById('ft-params');
  const memOut = document.getElementById('ft-mem');
  const timeOut = document.getElementById('ft-time');
  const gpuOut = document.getElementById('ft-gpu');
  if (!sizeSel) return;

  const sizes = {
    '125M':   0.125e9,
    '1B':     1.0e9,
    '7B':     7.0e9,
    '13B':    13.0e9,
    '70B':    70.0e9
  };

  function calc() {
    const N = sizes[sizeSel.value];
    const method = methodSel.value;
    const r = parseInt(rankSel.value);
    const bits = parseInt(bitsSel.value);

    // Trainable params
    let trainable;
    if (method === 'full') trainable = N;
    else if (method === 'lora') {
      // ~2 * r * d * num_adapted_layers. Rough: 0.05% per r=8, 0.15% per r=16
      trainable = N * (0.0006 * r);
    } else if (method === 'qlora') {
      trainable = N * (0.0006 * r);
    } else if (method === 'ptuning') {
      trainable = 1e6;
    }

    // Memory: base model at bits-bit + optimizer (Adam = 2x grads = 8x fp32 trainable)
    const baseMem = N * (bits / 8);
    let optMem;
    if (method === 'full') optMem = N * 16;
    else optMem = trainable * 16;
    const totalGB = (baseMem + optMem) / 1e9;

    // Training time (rough): scales with trainable * tokens
    const time = (trainable / 1e6) * 0.002;

    // GPU recommendation
    let gpu = 'CPU · don\'t';
    if (totalGB < 10) gpu = 'T4 / 3060 (16GB) ✓';
    else if (totalGB < 20) gpu = 'A10 / 3090 (24GB)';
    else if (totalGB < 40) gpu = 'A100 40GB';
    else if (totalGB < 80) gpu = 'A100 80GB / H100';
    else if (totalGB < 200) gpu = '2× H100 NVLink';
    else gpu = 'H100 cluster 8× 💸';

    paramsOut.textContent = formatNum(trainable);
    memOut.textContent = totalGB.toFixed(1) + ' GB';
    timeOut.textContent = time < 1 ? (time*60).toFixed(0) + ' min/epoch' : time.toFixed(1) + ' h/epoch';
    gpuOut.textContent = gpu;
    gpuOut.style.color = totalGB < 20 ? '#5ff08d' : totalGB < 80 ? '#ffa84d' : '#ff5cac';

    // Toggle rank control for LoRA/QLoRA
    const rankWrap = document.getElementById('rank-wrap');
    const bitsWrap = document.getElementById('bits-wrap');
    if (rankWrap) rankWrap.style.opacity = (method === 'lora' || method === 'qlora') ? '1' : '0.4';
    if (bitsWrap) bitsWrap.style.opacity = method === 'qlora' ? '1' : '0.4';
  }

  function formatNum(n) {
    if (n < 1e6) return (n/1e3).toFixed(0) + 'K';
    if (n < 1e9) return (n/1e6).toFixed(1) + 'M';
    return (n/1e9).toFixed(2) + 'B';
  }

  [sizeSel, methodSel, rankSel, bitsSel].forEach(el => el.addEventListener('change', calc));
  calc();
};
