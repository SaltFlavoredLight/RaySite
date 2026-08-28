// cubic-bezier-editor.js
export default class CubicBezierEditor {
  /**
   * container: DOM element where the editor will be mounted
   * options: {
   *   entry: [x1, y1, x2, y2], // initial coordinates (numbers 0..1)
   *   easyMode: false,         // toggle easy mode (appends preset name when matching)
   *   roundTo: 2,              // decimal places precision (default: 2)
   *   onChange: function(data) // called with { coords: [...], css: '...', preview: '...', html: '...' }
   * }
   */
  constructor(container, options = {}) {
    if (!container || !(container instanceof Element)) {
      throw new Error('CubicBezierEditor requires a DOM container element');
    }

    this.container = container;
    this.options = options;
    this.easyMode = Boolean(options.easyMode);
    this.roundTo = typeof options.roundTo === 'number' && options.roundTo >= 0 ? options.roundTo : 2;

    const initialEntry = Array.isArray(options.entry) && options.entry.length === 4
      ? options.entry.map(Number)
      : [0.25, 0.1, 0.25, 1];

    // Apply initial precision rounding
    this.coordinates = this._roundCoords(initialEntry);

    this.onChange = typeof options.onChange === 'function' ? options.onChange : null;

    // Standard presets map
    this.presets = {
      'linear': [0, 0, 1, 1],
      'ease': [0.25, 0.1, 0.25, 1],
      'ease-in': [0.42, 0, 1, 1],
      'ease-out': [0, 0, 0.58, 1],
      'ease-in-out': [0.42, 0, 0.58, 1]
    };

    // internal references
    this._elements = {};
    this._listeners = [];
    this._isInitialized = false;
  }

  // Alias getter/setter for compatibility
  get coords() {
    return this.coordinates;
  }

  set coords(val) {
    this.coordinates = val;
  }

  toString() {
    return `cubic-bezier(${this.coordinates.join(',')})`;
  }

  init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    // Build DOM
    const wrap = document.createElement('div');
    wrap.className = 'cbe-wrap';
    wrap.style.position = 'relative';
    wrap.style.display = 'inline-block';

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.border = '1px solid #ccc';
    canvas.style.background = '#fafafa';
    canvas.className = 'cbe-canvas';

    const handle1 = document.createElement('div');
    const handle2 = document.createElement('div');
    [handle1, handle2].forEach(h => {
      h.className = 'cbe-handle';
      Object.assign(h.style, {
        width: '14px',
        height: '14px',
        background: '#ff4080',
        borderRadius: '50%',
        position: 'absolute',
        cursor: 'pointer',
        transform: 'translate(-7px, -7px)',
        touchAction: 'none',
      });
    });

    const output = document.createElement('div');
    output.className = 'cbe-output';
    output.style.marginTop = '12px';
    output.style.fontFamily = 'sans-serif';
    output.style.fontSize = '14px';

    wrap.appendChild(canvas);
    wrap.appendChild(handle1);
    wrap.appendChild(handle2);
    this.container.appendChild(wrap);
    this.container.appendChild(output);

    // store refs
    this._elements = { wrap, canvas, handle1, handle2, output };

    // create canvas helper
    this._bc = new CubicBezierCanvas(canvas, this);

    // initial render
    this._updateHandles();
    this._redraw();

    // make draggable
    this._makeDraggable(handle1, 0);
    this._makeDraggable(handle2, 1);

    // touch support
    this._addTouchSupport(handle1, 0);
    this._addTouchSupport(handle2, 1);
  }

  getResult() {
    return this.coordinates.slice();
  }

  getPreview() {
    const coordsStr = this.coordinates.join(', ');
    if (this.easyMode) {
      const match = this._getMatchingPreset();
      if (match) return `${coordsStr} - ${match}`;
    }
    return coordsStr;
  }

  getHTML() {
    if (this.easyMode) {
      const match = this._getMatchingPreset();
      if (match) return match;
    }
    return `cubic-bezier(${this.coordinates.join(', ')})`;
  }

  setPreset(name) {
    if (this.presets[name]) {
      this.setEntry(this.presets[name]);
    }
  }

  setEntry(entry) {
    if (!Array.isArray(entry) || entry.length !== 4) {
      throw new Error('setEntry expects an array of 4 numbers');
    }
    this.coordinates = this._roundCoords(entry);
    if (this._bc) {
      this._updateHandles();
      this._redraw();
      this._emitChange();
    }
  }

  destroy() {
    // remove listeners
    this._listeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
    this._listeners = [];

    // remove DOM
    if (this._elements.wrap && this._elements.wrap.parentNode) {
      this._elements.wrap.parentNode.removeChild(this._elements.wrap);
    }
    if (this._elements.output && this._elements.output.parentNode) {
      this._elements.output.parentNode.removeChild(this._elements.output);
    }

    this._elements = {};
    this._isInitialized = false;
  }

  // Internal helpers

  _roundNumber(val) {
    return Number(Math.round(val + 'e' + this.roundTo) + 'e-' + this.roundTo);
  }

  _roundCoords(coords) {
    return coords.map(n => this._roundNumber(Number(n)));
  }

  _getMatchingPreset() {
    const [x1, y1, x2, y2] = this.coordinates;

    // Linear check: Handles lie anywhere on the diagonal (y = x line)
    if (Math.abs(x1 - y1) <= 0.001 && Math.abs(x2 - y2) <= 0.001) {
      return 'linear';
    }

    // Standard preset checks
    for (const [name, values] of Object.entries(this.presets)) {
      if (name === 'linear') continue;
      if (values.every((v, i) => Math.abs(v - this.coordinates[i]) <= 0.001)) {
        return name;
      }
    }
    return null;
  }

  _emitChange() {
    const css = `cubic-bezier(${this.coordinates.join(',')})`;
    const preview = this.getPreview();
    const html = this.getHTML();

    if (this._elements.output) {
      this._elements.output.textContent = html;
    }
    if (this.onChange) {
      try {
        this.onChange({ coords: this.getResult(), css, preview, html });
      } catch (e) {
        // swallow user callback errors
        console.error(e);
      }
    }
  }

  _updateHandles() {
    const [x1, y1, x2, y2] = this.coordinates;
    const [cx1, cy1] = this._bc.bezierToCanvas(x1, y1);
    const [cx2, cy2] = this._bc.bezierToCanvas(x2, y2);

    // Rounded strictly to integer pixels
    this._elements.handle1.style.left = Math.round(cx1) + 'px';
    this._elements.handle1.style.top = Math.round(cy1) + 'px';
    this._elements.handle2.style.left = Math.round(cx2) + 'px';
    this._elements.handle2.style.top = Math.round(cy2) + 'px';
  }

  _redraw() {
    this._bc.plot();
    this._emitChange();
  }

  _makeDraggable(handle, index) {
    const onMouseDown = (e) => {
      e.preventDefault();
      const move = (ev) => {
        const rect = this._elements.canvas.getBoundingClientRect();
        const px = Math.round(ev.clientX - rect.left);
        const py = Math.round(ev.clientY - rect.top);
        this._applyPointerToCoord(px, py, index);
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    };
    handle.addEventListener('mousedown', onMouseDown);
    this._listeners.push({ target: handle, type: 'mousedown', fn: onMouseDown });
  }

  _addTouchSupport(handle, index) {
    const onTouchStart = (e) => {
      e.preventDefault();
      const move = (ev) => {
        const touch = ev.touches[0];
        if (!touch) return;
        const rect = this._elements.canvas.getBoundingClientRect();
        const px = Math.round(touch.clientX - rect.left);
        const py = Math.round(touch.clientY - rect.top);
        this._applyPointerToCoord(px, py, index);
      };
      const end = () => {
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
        document.removeEventListener('touchcancel', end);
      };
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end);
      document.addEventListener('touchcancel', end);
    };
    handle.addEventListener('touchstart', onTouchStart, { passive: false });
    this._listeners.push({ target: handle, type: 'touchstart', fn: onTouchStart });
  }

  _applyPointerToCoord(px, py, index) {
    const [bx, by] = this._bc.canvasToBezier(px, py);
    // clamp 0..1
    const cx = Math.max(0, Math.min(1, bx));
    const cy = Math.max(0, Math.min(1, by));

    this.coordinates[index * 2] = this._roundNumber(cx);
    this.coordinates[index * 2 + 1] = this._roundNumber(cy);

    this._updateHandles();
    this._redraw();
  }
}

/* -----------------------------------------------------------
   Internal Canvas Renderer Class
----------------------------------------------------------- */

class CubicBezierCanvas {
  constructor(canvas, bezier) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bezier = bezier;
  }

  plot() {
    const ctx = this.ctx;
    const [x1, y1, x2, y2] = this.bezier.coordinates;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(0, this.canvas.height);
    ctx.scale(this.canvas.width, -this.canvas.height);

    // control lines
    ctx.lineWidth = 0.01;
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(1, 1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // control points
    ctx.fillStyle = '#ff4080';
    ctx.beginPath();
    ctx.arc(x1, y1, 0.015, 0, Math.PI * 2);
    ctx.arc(x2, y2, 0.015, 0, Math.PI * 2);
    ctx.fill();

    // bezier curve
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.02;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(x1, y1, x2, y2, 1, 1);
    ctx.stroke();

    ctx.restore();
  }

  canvasToBezier(px, py) {
    // Direct integer rounding on pixel coordinates within canvas boundaries
    const clampedPx = Math.max(0, Math.min(this.canvas.width, Math.round(px)));
    const clampedPy = Math.max(0, Math.min(this.canvas.height, Math.round(py)));
    return [clampedPx / this.canvas.width, 1 - clampedPy / this.canvas.height];
  }

  bezierToCanvas(x, y) {
    return [
      Math.round(x * this.canvas.width),
      Math.round((1 - y) * this.canvas.height)
    ];
  }
}