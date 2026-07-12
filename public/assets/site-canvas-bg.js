// Animated line-art background, reused across multiple containers on
// the page (the header bar, and the full-hero background). Uses p5's
// instance mode so each container gets its own independent sketch,
// sized to that container instead of window.innerWidth/innerHeight —
// the same proportional pattern fills whatever rectangle it's given.
(function () {
  var CONTAINER_CLASS = 'codex-canvas-bg';

  function makeSketch(container) {
    var inverted = container.getAttribute('data-invert') === 'true';
    return function (p) {
      var config = {
        width: 0,
        height: 0,
        dpr: 1,
        seed: 0,
        interval: 500,
        numLines: 10,
      };
      var pts = [];
      var canvas = null;

      function doSetup() {
        config.width = container.clientWidth || window.innerWidth;
        config.height = container.clientHeight || 120;

        // Density scales with the larger dimension so both wide/short
        // (header bar) and tall/large (full hero background) containers
        // get a comparable amount of line detail instead of looking sparse.
        var longSide = Math.max(config.width, config.height);
        config.numLines = longSide / 22;

        if (canvas) {
          canvas.remove();
        }
        canvas = p.createCanvas(config.width, config.height);
        p.pixelDensity(config.dpr);

        pts = [];
        pts.push({
          x: config.width * p.random(0.2, 0.45),
          y: config.height * p.random(0.2, 0.45),
        });
        pts.push({
          x: config.width * p.random(0.55, 0.85),
          y: config.height * p.random(0.15, 0.45),
        });
        pts.push({
          x: config.width * p.random(0.2, 0.45),
          y: config.height * p.random(0.55, 0.85),
        });
        pts.push({
          x: config.width * p.random(0.55, 0.85),
          y: config.height * p.random(0.55, 0.85),
        });

        p.redraw();
      }

      function line2(x0, y0, x1, y1, a) {
        var h = Math.round(Math.sin(x0 * y1 * 21911 + y0 * 17.3 + x1 * 0.012) * 1000) / 1000;
        var s = h > 0 ? -1 : 1;
        var s2 = Math.abs(h) > 0.5 ? -1 : 1;

        var r = Math.abs(h) * 0.3 + 0.1;
        var rn = 1 - r;
        var r1 = (h / 2 + 0.5) * 0.3 + 0.1;
        var r1n = 1 - r1;

        p.beginShape();
        p.curveVertex(x0, y0);
        p.curveVertex(x0 - s / 2, y0 + s / 2);
        p.curveVertex(
          x0 * rn + x1 * r - a * s,
          y0 * rn + y1 * r + (a * s2) / 2
        );
        p.curveVertex(
          x0 * r1 + x1 * r1n - a * s2,
          y0 * r1 + y1 * r1n - (a * s) / 2
        );
        p.curveVertex(x1 + (a / 3) * s, y1);
        p.curveVertex(x1 - (a / 2) * s, y1 + (a / 2) * s);
        p.endShape();
      }

      function lines(x0, y0, x1, y1, x2, y2, x3, y3, n) {
        var dx01 = x1 - x0;
        var sx01 = dx01 / n;
        var dy01 = y1 - y0;
        var sy01 = dy01 / n;
        var dx23 = x3 - x2;
        var sx23 = dx23 / n;
        var dy23 = y3 - y2;
        var sy23 = dy23 / n;
        var $x0, $y0, $x1, $y1, io;

        for (var i = 0; i < n; i++) {
          io = i + 0.5;
          $x0 = x0 + io * sx01;
          $y0 = y0 + io * sy01;
          $x1 = x2 + io * sx23;
          $y1 = y2 + io * sy23;
          line2($x0, $y0, $x1, $y1, config.width * 0.004);
          line2($x0, $y0, $x1, $y1, config.width * 0.003);
        }
      }

      p.setup = function () {
        if (config.seed > 0) {
          p.randomSeed(config.seed);
        }
        p.noLoop();
        doSetup();
        if (container.getAttribute('data-static') !== 'true') {
          setInterval(doSetup, config.interval);
        }
      };

      p.draw = function () {
        if (inverted) {
          p.background(255);
          p.strokeWeight(0.8);
          p.stroke(0);
        } else {
          p.background(0);
          p.strokeWeight(0.8);
          p.stroke(255);
        }
        p.noFill();

        var mw = 0.05 * config.width;
        var mh = 0.05 * config.height;
        var d = config.numLines;

        lines(-mw, -mh, -mw, pts[0].y, pts[0].x - mw / 2, -mh, pts[0].x, pts[0].y, d);

        lines(
          pts[0].x - mw / 2, -mh,
          pts[1].x + mw / 2, -mh,
          pts[0].x, pts[0].y,
          pts[1].x, pts[1].y,
          d
        );

        lines(
          pts[1].x + mw / 2, -mh,
          pts[1].x, pts[1].y,
          config.width + mw, -mh,
          config.width + mw, pts[1].y - mh / 4,
          d
        );

        lines(-mw, pts[0].y, pts[0].x, pts[0].y, -mw, pts[2].y, pts[2].x, pts[2].y, d);

        lines(
          pts[0].x, pts[0].y,
          pts[2].x, pts[2].y,
          pts[1].x, pts[1].y,
          pts[3].x, pts[3].y,
          d
        );

        lines(
          pts[1].x, pts[1].y,
          config.width + mw, pts[1].y - mh / 4,
          pts[3].x, pts[3].y,
          config.width + mw, pts[3].y - mh / 2,
          d
        );

        lines(
          -mw, pts[2].y,
          -mw, config.height + mh,
          pts[2].x, pts[2].y,
          pts[2].x - mw / 3, config.height + mh / 2,
          d
        );

        lines(
          pts[2].x, pts[2].y,
          pts[3].x, pts[3].y,
          pts[2].x - mw / 3, config.height + mh / 2,
          pts[3].x + mw / 2, config.height + mh / 5,
          d
        );

        lines(
          pts[3].x, pts[3].y,
          pts[3].x + mw / 2, config.height + mh / 5,
          config.width + mw, pts[3].y - mh / 2,
          config.width + mw * 1.5, config.height + mh,
          d
        );
      };

      p.windowResized = function () {
        doSetup();
      };
    };
  }

  function init() {
    var containers = document.querySelectorAll('.' + CONTAINER_CLASS);
    containers.forEach(function (el) {
      // This script tag is included multiple times on some pages (once per
      // section that uses a canvas background). Guard against re-running
      // init() on a container that's already been set up -- otherwise each
      // inclusion stacks a brand new p5 instance/canvas on top of the last,
      // which causes visible flicker and extra work during page load.
      if (el.getAttribute('data-codex-canvas-initialized') === 'true') {
        return;
      }
      el.setAttribute('data-codex-canvas-initialized', 'true');
      new p5(makeSketch(el), el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
