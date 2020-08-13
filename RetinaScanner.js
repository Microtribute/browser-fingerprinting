
/*
 * RetinaScanner mainly based on Fingerprint.js
 */
(function () {
  let defaultOptions = {
    preprocessor: null,
    audio: {
      timeout: 1000,
      // On iOS 11, audio context can only be used in response to user interaction.
      // We require users to explicitly enable audio fingerprinting on iOS 11.
      // See https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
      excludeIOS11: true,
    },
    screen: {
      // To ensure consistent fingerprints when users rotate their mobile devices
      detectScreenOrientation: true,
    },
    plugins: {
      sortPluginsFor: [/palemoon/i],
      excludeIE: false,
    },

    extraComponents: [],

    excludes: {
      // Unreliable on Windows, see https://github.com/Valve/fingerprintjs2/issues/375
      enumerateDevices: true,
      // devicePixelRatio depends on browser zoom, and it's impossible to detect browser zoom
      pixelRatio: true,
      // DNT depends on incognito mode for some browsers (Chrome) and it's impossible to detect incognito mode
      doNotTrack: true,
    },
    NOT_AVAILABLE: "Not Available",
    ERROR: "Error",
    EXCLUDED: "Excluded",
  };

  let each = function (obj, iterator) {
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator);
    } else if (obj.length === +obj.length) {
      for (let i = 0, l = obj.length; i < l; i++) {
        iterator(obj[i], i, obj);
      }
    } else {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator(obj[key], key, obj);
        }
      }
    }
  };

  let map = function (obj, iterator) {
    let results = [];
    // Not using strict equality so that this acts as a
    // shortcut to checking for `null` and `undefined`.
    if (obj == null) {
      return results;
    }
    if (Array.prototype.map && obj.map === Array.prototype.map) {
      return obj.map(iterator);
    }
    each(obj, function (value, index, list) {
      results.push(iterator(value, index, list));
    });
    return results;
  };

  let extendSoft = function (target, source) {
    if (source == null) {
      return target;
    }
    let value, key;

    for (key in source) {
      value = source[key];
      if (value != null && !Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = value;
      }
    }

    return target;
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
  let enumerateDevicesKey = function (done, options) {
    if (!isEnumerateDevicesSupported()) {
      return done(options.NOT_AVAILABLE);
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        done(
          devices.map(function (device) {
            return (
              "id=" +
              device.deviceId +
              ";gid=" +
              device.groupId +
              ";" +
              device.kind +
              ";" +
              device.label
            );
          })
        );
      })
      .catch(function (error) {
        done(error);
      });
  };

  let isEnumerateDevicesSupported = function () {
    return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
  };
  // Inspired by and based on https://github.com/cozylife/audio-fingerprint
  let audioKey = function (done, options) {
    let audioOptions = options.audio;
    if (
      audioOptions.excludeIOS11 &&
      navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)
    ) {
      // See comment for excludeUserAgent and https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
      return done(options.EXCLUDED);
    }

    let AudioContext =
      window.OfflineAudioContext || window.webkitOfflineAudioContext;

    if (AudioContext == null) {
      return done(options.NOT_AVAILABLE);
    }

    let context = new AudioContext(1, 44100, 44100);

    let oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, context.currentTime);

    let compressor = context.createDynamicsCompressor();
    each(
      [
        ["threshold", -50],
        ["knee", 40],
        ["ratio", 12],
        ["reduction", -20],
        ["attack", 0],
        ["release", 0.25],
      ],
      function (item) {
        if (
          compressor[item[0]] !== undefined &&
          typeof compressor[item[0]].setValueAtTime === "function"
        ) {
          compressor[item[0]].setValueAtTime(item[1], context.currentTime);
        }
      }
    );

    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    context.startRendering();

    let audioTimeoutId = setTimeout(function () {
      console.warn(
        'Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' +
        navigator.userAgent +
        '".'
      );
      context.oncomplete = function () { };
      context = null;
      return done("audioTimeout");
    }, audioOptions.timeout);

    context.oncomplete = function (event) {
      let fingerprint;

      try {
        clearTimeout(audioTimeoutId);
        fingerprint = event.renderedBuffer
          .getChannelData(0)
          .slice(4500, 5000)
          .reduce(function (acc, val) {
            return acc + Math.abs(val);
          }, 0)
          .toString();
        oscillator.disconnect();
        compressor.disconnect();
      } catch (error) {
        done(error);
        return;
      }

      done(fingerprint);
    };
  };

  let UserAgent = function (done) {
    done(navigator.userAgent);
  };
  let webdriver = function (done, options) {
    done(
      navigator.webdriver == null ? options.NOT_AVAILABLE : navigator.webdriver
    );
  };
  let languageKey = function (done, options) {
    done(
      navigator.language ||
      navigator.userLanguage ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      options.NOT_AVAILABLE
    );
  };
  let colorDepthKey = function (done, options) {
    done(window.screen.colorDepth || options.NOT_AVAILABLE);
  };
  let deviceMemoryKey = function (done, options) {
    done(navigator.deviceMemory || options.NOT_AVAILABLE);
  };
  let pixelRatioKey = function (done, options) {
    done(window.devicePixelRatio || options.NOT_AVAILABLE);
  };
  let screenResolutionKey = function (done, options) {
    done(getScreenResolution(options));
  };
  let getScreenResolution = function (options) {
    let resolution = [window.screen.width, window.screen.height];
    if (options.screen.detectScreenOrientation) {
      resolution.sort().reverse();
    }
    return resolution;
  };
  let availableScreenResolutionKey = function (done, options) {
    done(getAvailableScreenResolution(options));
  };
  let getAvailableScreenResolution = function (options) {
    if (window.screen.availWidth && window.screen.availHeight) {
      let available = [window.screen.availHeight, window.screen.availWidth];
      if (options.screen.detectScreenOrientation) {
        available.sort().reverse();
      }
      return available;
    }
    // headless browsers
    return options.NOT_AVAILABLE;
  };
  let timezoneOffset = function (done) {
    done(new Date().getTimezoneOffset());
  };
  let timezone = function (done, options) {
    if (window.Intl && window.Intl.DateTimeFormat) {
      done(new window.Intl.DateTimeFormat().resolvedOptions().timeZone);
      return;
    }
    done(options.NOT_AVAILABLE);
  };
  let sessionStorageKey = function (done, options) {
    done(hasSessionStorage(options));
  };
  let localStorageKey = function (done, options) {
    done(hasLocalStorage(options));
  };
  let indexedDbKey = function (done, options) {
    done(hasIndexedDB(options));
  };
  let addBehaviorKey = function (done) {
    // body might not be defined at this point or removed programmatically
    done(!!(document.body && document.body.addBehavior));
  };
  let openDatabaseKey = function (done) {
    done(!!window.openDatabase);
  };
  let cpuClassKey = function (done, options) {
    done(getNavigatorCpuClass(options));
  };
  let platformKey = function (done, options) {
    done(getNavigatorPlatform(options));
  };
  let doNotTrackKey = function (done, options) {
    done(getDoNotTrack(options));
  };
  let canvasKey = function (done, options) {
    if (isCanvasSupported()) {
      done(getCanvasFp(options));
      return;
    }
    done(options.NOT_AVAILABLE);
  };
  let webglKey = function (done, options) {
    if (isWebGlSupported()) {
      done(getWebglFp());
      return;
    }
    done(options.NOT_AVAILABLE);
  };
  let webglVendorAndRendererKey = function (done) {
    if (isWebGlSupported()) {
      done(getWebglVendorAndRenderer());
      return;
    }
    done();
  };
  let adBlockKey = function (done) {
    done(getAdBlock());
  };

  // kudos to http://www.lalit.org/lab/javascript-css-font-detect/

  let pluginsComponent = function (done, options) {
    if (isIE()) {
      if (!options.plugins.excludeIE) {
        done(getIEPlugins(options));
      } else {
        done(options.EXCLUDED);
      }
    } else {
      done(getRegularPlugins(options));
    }
  };
  let getRegularPlugins = function (options) {
    if (navigator.plugins == null) {
      return options.NOT_AVAILABLE;
    }

    let plugins = [];
    // plugins isn't defined in Node envs.
    for (let i = 0, l = navigator.plugins.length; i < l; i++) {
      if (navigator.plugins[i]) {
        plugins.push(navigator.plugins[i]);
      }
    }

    // sorting plugins only for those user agents, that we know randomize the plugins
    // every time we try to enumerate them
    if (pluginsShouldBeSorted(options)) {
      plugins = plugins.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    }
    return map(plugins, function (p) {
      let mimeTypes = map(p, function (mt) {
        return [mt.type, mt.suffixes];
      });
      return [p.name, p.description, mimeTypes];
    });
  };
  let getIEPlugins = function (options) {
    let result = [];
    if (
      (Object.getOwnPropertyDescriptor &&
        Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
      "ActiveXObject" in window
    ) {
      let names = [
        "AcroPDF.PDF", // Adobe PDF reader 7+
        "Adodb.Stream",
        "AgControl.AgControl", // Silverlight
        "DevalVRXCtrl.DevalVRXCtrl.1",
        "MacromediaFlashPaper.MacromediaFlashPaper",
        "Msxml2.DOMDocument",
        "Msxml2.XMLHTTP",
        "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
        "QuickTime.QuickTime", // QuickTime
        "QuickTimeCheckObject.QuickTimeCheck.1",
        "RealPlayer",
        "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
        "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
        "Scripting.Dictionary",
        "SWCtl.SWCtl", // ShockWave player
        "Shell.UIHelper",
        "ShockwaveFlash.ShockwaveFlash", // flash plugin
        "Skype.Detection",
        "TDCCtl.TDCCtl",
        "WMPlayer.OCX", // Windows media player
        "rmocx.RealPlayer G2 Control",
        "rmocx.RealPlayer G2 Control.1",
      ];
      // starting to detect plugins in IE
      result = map(names, function (name) {
        try {
          // eslint-disable-next-line no-new
          new window.ActiveXObject(name);
          return name;
        } catch (e) {
          return options.ERROR;
        }
      });
    } else {
      result.push(options.NOT_AVAILABLE);
    }
    if (navigator.plugins) {
      result = result.concat(getRegularPlugins(options));
    }
    return result;
  };
  let pluginsShouldBeSorted = function (options) {
    let should = false;
    for (let i = 0, l = options.plugins.sortPluginsFor.length; i < l; i++) {
      let re = options.plugins.sortPluginsFor[i];
      if (navigator.userAgent.match(re)) {
        should = true;
        break;
      }
    }
    return should;
  };
  let touchSupportKey = function (done) {
    done(getTouchSupport());
  };
  let hardwareConcurrencyKey = function (done, options) {
    done(getHardwareConcurrency(options));
  };
  let hasSessionStorage = function (options) {
    try {
      return !!window.sessionStorage;
    } catch (e) {
      return options.ERROR; // SecurityError when referencing it means it exists
    }
  };

  // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
  let hasLocalStorage = function (options) {
    try {
      return !!window.localStorage;
    } catch (e) {
      return options.ERROR; // SecurityError when referencing it means it exists
    }
  };
  let hasIndexedDB = function (options) {
    try {
      return !!window.indexedDB;
    } catch (e) {
      return options.ERROR; // SecurityError when referencing it means it exists
    }
  };
  let getHardwareConcurrency = function (options) {
    if (navigator.hardwareConcurrency) {
      return navigator.hardwareConcurrency;
    }
    return options.NOT_AVAILABLE;
  };
  let getNavigatorCpuClass = function (options) {
    return navigator.cpuClass || options.NOT_AVAILABLE;
  };
  let getNavigatorPlatform = function (options) {
    if (navigator.platform) {
      return navigator.platform;
    } else {
      return options.NOT_AVAILABLE;
    }
  };
  let getDoNotTrack = function (options) {
    if (navigator.doNotTrack) {
      return navigator.doNotTrack;
    } else if (navigator.msDoNotTrack) {
      return navigator.msDoNotTrack;
    } else if (window.doNotTrack) {
      return window.doNotTrack;
    } else {
      return options.NOT_AVAILABLE;
    }
  };

  // This is a crude and primitive touch screen detection.
  // It's not possible to currently reliably detect the  availability of a touch screen
  // with a JS, without actually subscribing to a touch event.
  // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
  // https://github.com/Modernizr/Modernizr/issues/548
  // method returns an array of 3 values:
  // maxTouchPoints, the success or failure of creating a TouchEvent,
  // and the availability of the 'ontouchstart' property

  let getTouchSupport = function () {
    let maxTouchPoints = 0;
    let touchEvent;

    if (typeof navigator.maxTouchPoints !== "undefined") {
      maxTouchPoints = navigator.maxTouchPoints;
    } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
      maxTouchPoints = navigator.msMaxTouchPoints;
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch (_) {
      touchEvent = false;
    }

    let touchStart = "ontouchstart" in window;

    return [maxTouchPoints, touchEvent, touchStart];
  };
  // https://www.browserleaks.com/canvas#how-does-it-work

  let getCanvasFp = function (options) {
    let result = [];
    // Very simple now, need to make it more complex (geo shapes etc)
    let canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 200;
    canvas.style.display = "inline";
    let ctx = canvas.getContext("2d");
    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    result.push(
      "canvas winding:" +
      (ctx.isPointInPath(5, 5, "evenodd") === false ? "yes" : "no")
    );

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    // https://github.com/Valve/fingerprintjs2/issues/66
    if (options.dontUseFakeFontInCanvas) {
      ctx.font = "11pt Arial";
    } else {
      ctx.font = "11pt no-real-font-123";
    }
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
    ctx.font = "18pt Arial";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

    // canvas blending
    // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(255,0,255)";
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(0,255,255)";
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(255,0,255)";
    // canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill("evenodd");

    if (canvas.toDataURL) {
      result.push("canvas fp:" + canvas.toDataURL());
    }
    return result;
  };
  let getWebglFp = function () {
    let fa2s = function (fa) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return "[" + fa[0] + ", " + fa[1] + "]";
    };

    let maxAnisotropy = function (gl) {
      let ext =
        gl.getExtension("EXT_texture_filter_anisotropic") ||
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
        gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
      if (ext) {
        let anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        if (anisotropy === 0) {
          anisotropy = 2;
        }
        return anisotropy;
      } else {
        return null;
      }
    };

    let gl = getWebglCanvas();
    if (!gl) {
      return null;
    }
    // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
    // First it draws a gradient object with shaders and convers the image to the Base64 string.
    // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
    // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
    let result = [];
    let vShaderTemplate =
      "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
    let fShaderTemplate =
      "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
    let vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    let vertices = new Float32Array([
      -0.2,
      -0.9,
      0,
      0.4,
      -0.26,
      0,
      0,
      0.732134444,
      0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;
    let program = gl.createProgram();
    let vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);
    let fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);
    program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
    program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
    gl.enableVertexAttribArray(program.vertexPosArray);
    gl.vertexAttribPointer(
      program.vertexPosAttrib,
      vertexPosBuffer.itemSize,
      gl.FLOAT,
      !1,
      0,
      0
    );
    gl.uniform2f(program.offsetUniform, 1, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
    try {
      result.push(gl.canvas.toDataURL());
    } catch (e) {
      /* .toDataURL may be absent or broken (blocked by extension) */
    }
    result.push("extensions:" + (gl.getSupportedExtensions() || []).join(";"));
    result.push(
      "webgl aliased line width range:" +
      fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
    );
    result.push(
      "webgl aliased point size range:" +
      fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE))
    );
    result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
    result.push(
      "webgl antialiasing:" +
      (gl.getContextAttributes().antialias ? "yes" : "no")
    );
    result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
    result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
    result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
    result.push("webgl max anisotropy:" + maxAnisotropy(gl));
    result.push(
      "webgl max combined texture image units:" +
      gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
    );
    result.push(
      "webgl max cube map texture size:" +
      gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)
    );
    result.push(
      "webgl max fragment uniform vectors:" +
      gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)
    );
    result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
    result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    );
    result.push(
      "webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE)
    );
    result.push(
      "webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS)
    );
    result.push(
      "webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
    );
    result.push(
      "webgl max vertex texture image units:" +
      gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
    );
    result.push(
      "webgl max vertex uniform vectors:" +
      gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
    );
    result.push(
      "webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS))
    );
    result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
    result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
    result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    );
    result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
    result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
    result.push("webgl version:" + gl.getParameter(gl.VERSION));

    try {
      // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
      let extensionDebugRendererInfo = gl.getExtension(
        "WEBGL_debug_renderer_info"
      );
      if (extensionDebugRendererInfo) {
        result.push(
          "webgl unmasked vendor:" +
          gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL)
        );
        result.push(
          "webgl unmasked renderer:" +
          gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL)
        );
      }
    } catch (e) {
      /* squelch */
    }

    if (!gl.getShaderPrecisionFormat) {
      return result;
    }

    each(["FLOAT", "INT"], function (numType) {
      each(["VERTEX", "FRAGMENT"], function (shader) {
        each(["HIGH", "MEDIUM", "LOW"], function (numSize) {
          each(["precision", "rangeMin", "rangeMax"], function (key) {
            let format = gl.getShaderPrecisionFormat(
              gl[shader + "_SHADER"],
              gl[numSize + "_" + numType]
            )[key];
            if (key !== "precision") {
              key = "precision " + key;
            }
            let line = [
              "webgl ",
              shader.toLowerCase(),
              " shader ",
              numSize.toLowerCase(),
              " ",
              numType.toLowerCase(),
              " ",
              key,
              ":",
              format,
            ].join("");
            result.push(line);
          });
        });
      });
    });
    return result;
  };
  
  let getWebglVendorAndRenderer = function () {
    /* This a subset of the WebGL fingerprint with a lot of entropy, while being reasonably browser-independent */
    try {
      let glContext = getWebglCanvas();
      let extensionDebugRendererInfo = glContext.getExtension(
        "WEBGL_debug_renderer_info"
      );
      return (
        glContext.getParameter(
          extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL
        ) +
        "~" +
        glContext.getParameter(
          extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL
        )
      );
    } catch (e) {
      return null;
    }
  };

  const getAdBlock = function () {
    let ads = document.createElement("div");
    ads.innerHTML = "&nbsp;";
    ads.className = "adsbox";
    let result = false;

    try {
      // body may not exist, that's why we need try/catch
      document.body.appendChild(ads);
      result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
      document.body.removeChild(ads);
    } catch (e) {
      result = false;
    }

    return result;
  };

  let isCanvasSupported = function () {
    let elem = document.createElement("canvas");
    return !!(elem.getContext && elem.getContext("2d"));
  };

  let isWebGlSupported = function () {
    // code taken from Modernizr
    if (!isCanvasSupported()) {
      return false;
    }

    let glContext = getWebglCanvas();
    return !!window.WebGLRenderingContext && !!glContext;
  };

  let isIE = function () {
    if (navigator.appName === "Microsoft Internet Explorer") {
      return true;
    } else if (
      navigator.appName === "Netscape" &&
      /Trident/.test(navigator.userAgent)
    ) {
      // IE 11
      return true;
    }
    return false;
  };

  const getWebglCanvas = function () {
    const canvas = document.createElement("canvas");
    const gl = null;

    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {
      /* squelch */
    }

    if (!gl) {
      gl = null;
    }

    return gl;
  };

  const components = [
    { key: "UserAgent", getData: getUserAgent },
    { key: "WebDriver", getData: getWebDriver },
    { key: "Language", getData: getLanguageCode },
    { key: "ColorDepth", getData: colorDepthKey },
    { key: "DeviceMemory", getData: deviceMemoryKey },
    { key: "DevicePixelRatio", getData: pixelRatioKey },
    { key: "HardwareConcurrency", getData: hardwareConcurrencyKey },
    { key: "ScreenResolution", getData: screenResolutionKey },
    { key: "AvailableScreenResolution", getData: availableScreenResolutionKey },
    { key: "TimezoneOffset", getData: timezoneOffset },
    { key: "Timezone", getData: timezone },
    { key: "SessionStorage", getData: sessionStorageKey },
    { key: "LocalStorage", getData: localStorageKey },
    { key: "IndexedDb", getData: indexedDbKey },
    { key: "AddBehavior", getData: addBehaviorKey },
    { key: "OpenDatabase", getData: openDatabaseKey },
    { key: "CpuClass", getData: cpuClassKey },
    { key: "Platform", getData: platformKey },
    { key: "DoNotTrack", getData: doNotTrackKey },
    { key: "Plugins", getData: pluginsComponent },
    { key: "Canvas", getData: canvasKey },
    { key: "WebGL", getData: webglKey },
    { key: "WebGLVendorAndRenderer", getData: webglVendorAndRendererKey },
    { key: "AdBlockEnabled", getData: adBlockKey },
    { key: "TouchSupport", getData: touchSupportKey },
    { key: "Audio", getData: audioKey },
    { key: "EnumerateDevices", getData: enumerateDevicesKey },
  ];

  const collectPatterns = function (callback, options = {}) {
    extendSoft(options, defaultOptions);
    options.components = options.extraComponents.concat(components);

    let keys = {
      data: [],
      addPreprocessedComponent: function (key, value) {
        if (typeof options.preprocessor === "function") {
          value = options.preprocessor(key, value);
        }
        keys.data.push({ key: key, value: value });
      },
    };

    let i = -1;

    let chainComponents = function (alreadyWaited) {
      i += 1;
      if (i >= options.components.length) {
        // on finish
        callback(keys.data);
        return;
      }
      let component = options.components[i];

      if (options.excludes[component.key]) {
        chainComponents(false); // skip
        return;
      }

      if (!alreadyWaited && component.pauseBefore) {
        i -= 1;
        setTimeout(function () {
          chainComponents(true);
        }, 1);
        return;
      }

      try {
        component.getData(function (value) {
          keys.addPreprocessedComponent(component.key, value);
          chainComponents(false);
        }, options);
      } catch (error) {
        // main body error
        keys.addPreprocessedComponent(component.key, String(error));
        chainComponents(false);
      }
    };

    chainComponents(false);
  };

  // class RetinaScanner {
  //   static sample(options) {
  //     return new Promise(function (resolve, reject) {
  //       collectPatterns(resolve, options);
  //     })
  //   }

  // return RetinaScanner
});
