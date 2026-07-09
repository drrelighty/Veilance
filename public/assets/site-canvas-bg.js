// Animated line-art background for the site header.
// Adapted from a full-window p5 sketch: same drawing logic, but the
// canvas is sized to the #codex-header-canvas-wrap container (the
// header bar) instead of window.innerWidth/innerHeight, so the same
// proportional pattern fills a wide, short strip instead of the full
// viewport.
(function () {
  var CONTAINER_ID = 'codex-header-canvas-wrap';

  var config = {
    width: 0,
    height: 0,
    dpr: 1,
    seed: 0,
    interval: 250,
    numLines: 10,
  };

  var pts = [];
  var canvas = null;

  function getContainer() {
    return document.getElementById(CONTAINER_ID);
  }

  window.setup = function () {
    if (config.seed > 0) {
      randomSeed(config.seed);
    }
    doSetup();
    setInterval(doSetup, config.interval);
  };

  function doSetup() {
    var el = getContainer();
    if (!el) return;

    config.width = el.clientWidth || window.innerWidth;
    config.height = el.clientHeight || 120;
    config.numLines = config.width / 45;

    if (canvas) {
      canvas.remove();
    }
    canvas = createCanvas(config.width, config.height);
    canvas.parent(CONTAINER_ID);
    pixelDensity(config.dpr);

    pts = [];
    pts.push({
      x: config.width * random(0.2, 0.45),
      y: config.height * random(0.2, 0.45),
    });
    pts.push({
      x: config.width * random(0.55, 0.85),
      y: config.height * random(0.15, 0.45),
    });
    pts.push({
      x: config.width * random(0.2, 0.45),
      y: config.height * random(0.55, 0.85),
    });
    pts.push({
      x: config.width * random(0.55, 0.85),
      y: config.height * random(0.55, 0.85),
    });

    draw();
  }

  function line2(x0, y0, x1, y1, a) {
    var h = round(sin(x0 * y1 * 21911 + y0 * 17.3 + x1 * 0.012) * 1000) / 1000;
    var s = h > 0 ? -1 : 1;
    var s2 = abs(h) > 0.5 ? -1 : 1;

    var r = abs(h) * 0.3 + 0.1;
    var rn = 1 - r;
    var r1 = (h / 2 + 0.5) * 0.3 + 0.1;
    var r1n = 1 - r1;

    beginShape();
    curveVertex(x0, y0);
    curveVertex(x0 - s / 2, y0 + s / 2);
    curveVertex(
      x0 * rn + x1 * r - a * s,
      y0 * rn + y1 * r + (a * s2) / 2
    );
    curveVertex(
      x0 * r1 + x1 * r1n - a * s2,
      y0 * r1 + y1 * r1n - (a * s) / 2
    );
    curveVertex(x1 + (a / 3) * s, y1);
    curveVertex(x1 - (a / 2) * s, y1 + (a / 2) * s);
    endShape();
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

  window.draw = function () {
    background(29);
    strokeWeight(0.8);
    stroke(230);
    noFill();

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

    noLoop();
  };

  window.windowResized = function () {
    doSetup();
  };
})();
