// cubic-bezier-editor.js
export default class CubicBezierEditor {
  /**
   * container: DOM element where the editor will be mounted
   * options: {
   *   entry: [x1, y1, x2, y2], // initial coordinates (numbers 0..1)
   *   easyMode: false,         // toggle easy mode
   *   roundTo: 2,              // decimal places precision
   *   size: 'auto',            // 'width', 'height', 'auto', or CSS size (e.g. '400px')
   *   showPreview: false,      // toggle text output label
   *   theme: {
   *     handleColor: '#ff4080',     // color of the control handles & points
   *     backgroundColor: '#fafafa', // canvas background (set 'transparent' for no fill)
   *     curveColor: '#000000',      // bezier curve stroke color
   *     lineColor: '#aaaaaa'        // handle connecting lines color
   *   },
   *   onChange: function(data)
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
    this.sizeOption = options.size || 'auto';
    this.showPreview = Boolean(options.showPreview);

    const defaultTheme = {
      handleColor: '#ff4080',
      backgroundColor: '#fafafa',
      curveColor: '#000000',
      lineColor: '#aaaaaa'
    };
    this.theme = Object.assign({}, defaultTheme, options.theme || {});

    const initialEntry = Array.isArray(options.entry) && options.entry.length === 4
      ? options.entry.map(Number)
      : [0.25, 0.1, 0.25, 1];

    this.coordinates = this._roundCoords(initialEntry);
    this.onChange = typeof options.onChange === 'function' ? options.onChange : null;

    this.presets = {
      'linear': [0, 0, 1, 1],
      'ease': [0.25, 0.1, 0.25, 1],
      'ease-in': [0.42, 0, 1, 1],
      'ease-out': [0, 0, 0.58, 1],
      'ease-in-out': [0.42, 0, 0.58, 1]
    };

    this._elements = {};
    this._listeners = [];
    this._isInitialized = false;
    this._resizeObserver = null;
  }

  get coords() { return this.coordinates; }
  set coords(val) { this.coordinates = val; }

  toString() {
    return `cubic-bezier(${this.coordinates.join(',')})`;
  }

  init() {
    if (this._isInitialized) return;
    this._isInitialized = true;

    if (getComputedStyle(this.container).overflow === 'visible') {
      this.container.style.overflow = 'hidden';
    }

    // Outer root wrapper to manage flex flow
    const mainWrap = document.createElement('div');
    mainWrap.className = 'cbe-main-wrap';
    Object.assign(mainWrap.style, {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%'
    });

    const wrap = document.createElement('div');
    wrap.className = 'cbe-wrap';
    Object.assign(wrap.style, {
      position: 'relative',
      display: 'block',
      lineHeight: '0',
      fontSize: '0',
      verticalAlign: 'top',
      flexShrink: '0'
    });

    const canvas = document.createElement('canvas');
    canvas.className = 'cbe-canvas';
    Object.assign(canvas.style, {
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      background: this.theme.backgroundColor === 'transparent' ? 'none' : this.theme.backgroundColor,
      display: 'block',
      verticalAlign: 'bottom'
    });

    const handle1 = document.createElement('div');
    const handle2 = document.createElement('div');
    [handle1, handle2].forEach(h => {
      h.className = 'cbe-handle';
      Object.assign(h.style, {
        width: '14px',
        height: '14px',
        background: this.theme.handleColor,
        borderRadius: '50%',
        position: 'absolute',
        cursor: 'pointer',
        transform: 'translate(-7px, -7px)',
        touchAction: 'none',
        zIndex: '2'
      });
    });

    wrap.appendChild(canvas);
    wrap.appendChild(handle1);
    wrap.appendChild(handle2);
    mainWrap.appendChild(wrap);

    this._elements = { mainWrap, wrap, canvas, handle1, handle2 };

    if (this.showPreview) {
      const output = document.createElement('p');
      output.className = 'cbe-output';
      Object.assign(output.style, {
        marginTop: '8px',
        marginBottom: '0',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        lineHeight: '1.4',
        textAlign: 'center',
        boxSizing: 'border-box',
        flexShrink: '0'
      });
      mainWrap.appendChild(output);
      this._elements.output = output;
    }

    this.container.appendChild(mainWrap);

    this._bc = new CubicBezierCanvas(canvas, this);

    this._updateDimensions();
    this._setupResizeObserver();

    this._makeDraggable(handle1, 0);
    this._makeDraggable(handle2, 1);
    this._addTouchSupport(handle1, 0);
    this._addTouchSupport(handle2, 1);
  }

  _updateDimensions() {
    if (!this._elements.canvas) return;

    const parentRect = this.container.getBoundingClientRect();
    
    // Subtract preview element height + top margin if visible
    let reservedHeight = 0;
    if (this.showPreview && this._elements.output) {
      const outputRect = this._elements.output.getBoundingClientRect();
      reservedHeight = outputRect.height + 8; // 8px margin
    }

    const availWidth = parentRect.width;
    const availHeight = Math.max(0, parentRect.height - reservedHeight);

    let targetSize = 300;

    if (this.sizeOption === 'width') {
      targetSize = availWidth;
    } else if (this.sizeOption === 'height') {
      targetSize = availHeight;
    } else if (this.sizeOption === 'auto') {
      if (availWidth > 0 && availHeight > 0) {
        targetSize = Math.min(availWidth, availHeight);
      } else {
        targetSize = availWidth || availHeight || 300;
      }
    } else {
      const tempEl = document.createElement('div');
      tempEl.style.width = this.sizeOption;
      tempEl.style.position = 'absolute';
      tempEl.style.visibility = 'hidden';
      document.body.appendChild(tempEl);
      targetSize = tempEl.getBoundingClientRect().width || 300;
      document.body.removeChild(tempEl);
    }

    const sizePx = Math.max(50, Math.floor(targetSize));

    // Force strict square bounds for canvas and handle wrap
    this._elements.canvas.width = sizePx;
    this._elements.canvas.height = sizePx;
    this._elements.canvas.style.width = `${sizePx}px`;
    this._elements.canvas.style.height = `${sizePx}px`;

    this._elements.wrap.style.width = `${sizePx}px`;
    this._elements.wrap.style.height = `${sizePx}px`;

    this._updateHandles();
    this._redraw();
  }

  _setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this._updateDimensions();
      });
      this._resizeObserver.observe(this.container);
    }
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
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    this._listeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
    this._listeners = [];

    if (this._elements.mainWrap && this._elements.mainWrap.parentNode) {
      this._elements.mainWrap.parentNode.removeChild(this._elements.mainWrap);
    }

    this._elements = {};
    this._isInitialized = false;
  }

  _roundNumber(val) {
    return Number(Math.round(val + 'e' + this.roundTo) + 'e-' + this.roundTo);
  }

  _roundCoords(coords) {
    return coords.map(n => this._roundNumber(Number(n)));
  }

  _getMatchingPreset() {
    const [x1, y1, x2, y2] = this.coordinates;

    if (Math.abs(x1 - y1) <= 0.001 && Math.abs(x2 - y2) <= 0.001) {
      return 'linear';
    }

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
        console.error(e);
      }
    }
  }

  _updateHandles() {
    const [x1, y1, x2, y2] = this.coordinates;
    const [cx1, cy1] = this._bc.bezierToCanvas(x1, y1);
    const [cx2, cy2] = this._bc.bezierToCanvas(x2, y2);

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
    const cx = Math.max(0, Math.min(1, bx));
    const cy = Math.max(0, Math.min(1, by));

    this.coordinates[index * 2] = this._roundNumber(cx);
    this.coordinates[index * 2 + 1] = this._roundNumber(cy);

    this._updateHandles();
    this._redraw();
  }
}

class CubicBezierCanvas {
  constructor(canvas, bezier) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bezier = bezier;
  }

  plot() {
    const ctx = this.ctx;
    const theme = this.bezier.theme;
    const [x1, y1, x2, y2] = this.bezier.coordinates;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (theme.backgroundColor && theme.backgroundColor !== 'transparent') {
      ctx.fillStyle = theme.backgroundColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.save();
    ctx.translate(0, this.canvas.height);
    ctx.scale(this.canvas.width, -this.canvas.height);

    ctx.lineWidth = 0.01;
    ctx.strokeStyle = theme.lineColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(1, 1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = theme.handleColor;
    ctx.beginPath();
    ctx.arc(x1, y1, 0.015, 0, Math.PI * 2);
    ctx.arc(x2, y2, 0.015, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = theme.curveColor;
    ctx.lineWidth = 0.02;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(x1, y1, x2, y2, 1, 1);
    ctx.stroke();

    ctx.restore();
  }

  canvasToBezier(px, py) {
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


