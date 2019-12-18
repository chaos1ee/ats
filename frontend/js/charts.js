Object.prototype.setAttributes =
  Object.prototype.setAttributes ||
  function(attributes) {
    const that = this;

    if (!_isDOM(that)) {
      throw Error('This must be DOM Element');
      return;
    }

    Object.entries(attributes).forEach(function(item) {
      that.setAttribute(item[0], item[1]);
    });

    return that;
  };

// creating svg element under the specific namespace
// otherwise the svg element can't be recognized
const SVG_VERSION = 'http://www.w3.org/2000/svg';

function _createSVGElem(tagName) {
  return document.createElementNS(SVG_VERSION, tagName);
}

function _isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function _isDOM(obj) {
  if (typeof HTMLElement === 'object') {
    return obj instanceof HTMLElement;
  } else {
    return (
      obj &&
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.nodeName === 'string'
    );
  }
}

const Charts = (function() {
  /**
   * painting rings
   * @param {string} selector css selector
   * @param {array} data
   */
  function ring(selector, data, emphasis) {
    const R = 30;
    const COLORS = ['#0abf5b', '#006eff', '#ff9d00', '#e54545'];

    let svg, container;

    try {
      ({ svg, container } = _init(selector));
    } catch (err) {
      throw err;
    }

    if (!Array.isArray(data)) {
      console.error("'data' param must be array.");
      return;
    }

    const DATA = data.slice(0).map(function(item) {
      item.value = Math.abs(item.value);
      return item;
    });

    const VIEWBOX_WIDTH = 100;
    const VIEWBOX_HEIGHT = 100;

    svg.setAttributes({
      style: 'width: 100%;height: 100%;',
      viewBox: `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`
    });

    const COUNT = DATA.reduce(function(acc, curr) {
      acc += curr.value;
      return acc;
    }, 0);

    if (COUNT === 0) {
      console.error('Sum of all data must be greater than 0');
      return;
    }

    function appendRings() {
      const g = _createSVGElem('g');

      // stroke-dashoffset
      let offset = 0;
      const L = 2 * Math.PI * R;

      let degree = -90;

      DATA.forEach(function(item, idx) {
        if (item.value === 0) {
          return;
        }

        const circle = _createSVGElem('circle');
        let l = (item.value / COUNT) * L;

        circle.setAttributes({
          r: R,
          cx: VIEWBOX_WIDTH / 2,
          cy: VIEWBOX_HEIGHT / 2,
          fill: 'transparent',
          transform: `rotate(${degree},50,50)`,
          stroke: COLORS[idx % COLORS.length],
          'stroke-width': 5,
          'stroke-dasharray': l - L / 180 + ',' + L
        });

        g.appendChild(circle);

        degree += (item.value / COUNT) * 360;
      });

      svg.appendChild(g);
    }

    function appendLegends() {
      const _R = 2;
      const FONT_SIZE = 6;
      const COLOR = '#333';
      const CUSTOM_SPACE_SIZE = 20;
      const LEN = data.length;

      let x = VIEWBOX_WIDTH / 2 + R + CUSTOM_SPACE_SIZE;
      let y = VIEWBOX_HEIGHT / 2 - (LEN / 2) * (LEN / 2 - 0.5) * FONT_SIZE;

      const text = _createSVGElem('text');

      text.setAttributes({
        'font-size': FONT_SIZE,
        'dominant-baseline': 'middle'
      });

      DATA.forEach(function(item, idx) {
        const circle = _createSVGElem('circle');

        circle.setAttributes({
          r: _R,
          cx: x - _R * 2,
          cy: y + _R / 2,
          fill: COLORS[idx % COLORS.length]
        });

        const tspan = _createSVGElem('tspan');
        tspan.innerHTML = `${item.name || '-'}&nbsp;${item.value}`;

        tspan.setAttributes({
          x: x,
          y: y,
          fill: COLOR
        });

        svg.appendChild(circle);
        text.appendChild(tspan);

        y += FONT_SIZE * 2;
      });

      svg.appendChild(text);
    }

    function appendEmphasis() {
      const text = _createSVGElem('text');

      let emphasisItem = data.find(function(item) {
        return item.name === emphasis;
      });

      if (!emphasisItem) {
        emphasisItem = data[0];
      }

      text.setAttribute('font-size', '0');

      text.innerHTML = `
        <tspan
          x="50%"
          y="50%"
          fill="${COLORS[0]}"
          font-size="12"
          text-anchor="middle"
          alignment-baseline="middle"
        >${((emphasisItem.value / COUNT) * 100).toFixed(0)}</tspan>
        <tspan 
          font-size="6"
          text-anchor="middle"
          alignment-baseline="middle"
        >%</tspan>
      `;

      svg.appendChild(text);
    }

    appendRings();
    appendLegends();
    appendEmphasis();
    container.appendChild(svg);
  }

  /**
   * painting bar
   * @param {string} selector css selector
   * @param {number} percent
   */
  function bar(selector, percent) {
    const COLOR = '#0abf5b';
    let svg, container;

    try {
      ({ svg, container } = _init(selector));
    } catch (err) {
      throw err;
    }

    if (Number.isNaN(percent)) {
      console.error("'data' param must be number.");
      return;
    }

    if (percent < 0) {
      console.error("Param 'percent' must be greater than 0");
      return;
    }

    svg.setAttributes({
      height: '8',
      viewBox: '0 0 100 8'
    });

    const line = _createSVGElem('line');
    const rect = _createSVGElem('rect');

    line.setAttributes({
      x1: 0,
      y1: 4,
      x2: percent,
      y2: 4,
      fill: 'none',
      'stroke-width': 10,
      stroke: COLOR
    });

    rect.setAttributes({
      x: 0,
      y: 0,
      style: "width: 100%;height: '100%'",
      fill: 'none',
      stroke: COLOR,
      'stroke-width': 1
    });

    svg.appendChild(line);
    svg.appendChild(rect);

    container.appendChild(svg);

    const span = document.createElement('span');
    span.innerHTML = percent.toFixed(2) + '%';
    container.appendChild(span);
  }

  /**
   * init container and svg element
   * @param {string} selector css selector
   */
  function _init(selector) {
    const container = document.querySelector(selector);

    if (!container) {
      throw Error("'selector' param must be valid CSS selector.");
    }

    const svg = _createSVGElem('svg');

    return {
      container: container,
      svg: svg
    };
  }

  return {
    bar: bar,
    ring: ring
  };
})();
