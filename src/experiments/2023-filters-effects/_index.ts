  // resizeCanvasToDisplaySize(canvas);

  /* ===== Program ===== */
  const program = createProgramFromSources(gl, vertShader, fragShader);


  // const texture = await loadTexture(gl, `/flowers.jpg`);
  // const texture = await loadTexture(gl, "/point_blank.JPG");
  // const texture = await loadTexture(gl, "/space-odyssey.jpg");
  // const texture = await loadTexture(gl, `/default_brick.png`);
  // const { texture, aspectRatio } = await loadTexture(gl, "/point_blank.JPG");
  // setTexture(gl, texture, aspectRatio);

  function setTexture(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    aspectRatio: number,
  ) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // set correct aspect ratio
    config['photo-x-top'] = aspectRatio;
    config['photo-x-bottom'] = -1;
    config['photo-y-right'] = 1;
    config['photo-y-left'] = -1;
    // TODO update model x & y
    const modelXOffset = Math.abs(1 - aspectRatio);
    // console.log(aspectRatio, modelXOffset);
    config.model.x = -(modelXOffset / 2);
    updatePhotoVertices(gl, config);
  }

  // useProgram must come before uniforms!
  gl.useProgram(program);
  // gl.enable(gl.DEPTH_TEST);

  /* ===== Uniforms ===== */
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  gl.uniform2f(uRes, canvas.width, canvas.height);
  const uPhoto = gl.getUniformLocation(program, 'textureID');
  gl.uniform1i(uPhoto, 0);

  enum Cursor {
    grab = 'grab',
    grabbing = 'grabbing',
  }

  let zoom = 1;
  // canvas.style.cursor = Cursor.grab;
  // window.addEventListener("wheel", (evt) => {
  //   zoom = clamp(zoom + evt.deltaY * 0.001, 0.1, 3);
  // });
  // let isDragging = false;
  // canvas.addEventListener("mousedown", () => {
  //   canvas.style.cursor = Cursor.grabbing;
  //   isDragging = true;
  // });
  // canvas.addEventListener("mouseup", () => {
  //   canvas.style.cursor = Cursor.grab;
  //   isDragging = false;
  // });
  // canvas.addEventListener("mousemove", (evt) => {
  //   if (isDragging) {
  //     // console.log(evt.movementX, evt.movementY);
  //     config.camera.x -= evt.movementX * 0.001;
  //     config.camera.y += evt.movementY * 0.001;
  //   }
  // });

  /* ===== Filters ===== */

  /* ===== Filter - Brightness ===== */
  const uBrightnessMatrix = gl.getUniformLocation(
    program,
    'u_brightnessMatrix',
  );
  const brightnessMatrix = mat4.create();
  gl.uniformMatrix4fv(uBrightnessMatrix, false, brightnessMatrix);
  const uBrightnessOffset = gl.getUniformLocation(
    program,
    'u_brightnessOffset',
  );
  const brightnessOffset = vec4.create();
  gl.uniform4f(
    uBrightnessOffset,
    brightnessOffset[0],
    brightnessOffset[1],
    brightnessOffset[2],
    brightnessOffset[3],
  );
  function updateBrightness(brightness: number) {
    if (!gl) return;
    // brightness between -1 and 1
    // gl.uniformMatrix4fv(uBrightnessMatrix, false, brightnessMatrix);
    vec4.set(brightnessOffset, brightness, brightness, brightness, 0);
    gl.uniform4f(
      uBrightnessOffset,
      brightnessOffset[0],
      brightnessOffset[1],
      brightnessOffset[2],
      brightnessOffset[3],
    );
  }

  /* ===== Filter - Contrast ===== */
  const uContrastMatrix = gl.getUniformLocation(program, 'u_contrastMatrix');
  const contrastMatrix = mat4.create();
  gl.uniformMatrix4fv(uContrastMatrix, false, contrastMatrix);
  const uContrastOffset = gl.getUniformLocation(program, 'u_contrastOffset');
  const contrastOffset = vec4.create();
  gl.uniform4f(
    uContrastOffset,
    contrastOffset[0],
    contrastOffset[1],
    contrastOffset[2],
    contrastOffset[3],
  );
  function updateContrast(contrast: number) {
    if (!gl) return;
    // contrast between -1 and 1
    const c = 1 + contrast;
    const o = 0.5 * (1 - c);
    // prettier-ignore
    mat4.transpose(contrastMatrix, [
			c, 0, 0, 0,
			0, c, 0, 0,
			0, 0, c, 0,
			0, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(uContrastMatrix, false, contrastMatrix);
    vec4.set(contrastOffset, o, o, o, 0);
    gl.uniform4f(uContrastOffset, o, o, o, 0);
  }

  /* ===== Filter - Exposure ===== */
  const uExposureMatrix = gl.getUniformLocation(program, 'u_exposureMatrix');
  const exposureMatrix = mat4.create();
  gl.uniformMatrix4fv(uExposureMatrix, false, exposureMatrix);
  function updateExposure(exposure: number) {
    if (!gl) return;
    // Exposure between -1 and 1
    const e = 1 + exposure;
    // prettier-ignore
    mat4.transpose(exposureMatrix, [
      e, 0, 0, 0,
      0, e, 0, 0,
      0, 0, e, 0,
      0, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(uExposureMatrix, false, exposureMatrix);
  }

  /* ===== Filter - Saturation ===== */
  const uSaturationMatrix = gl.getUniformLocation(
    program,
    'u_saturationMatrix',
  );
  const saturationMatrix = mat4.create();
  gl.uniformMatrix4fv(uSaturationMatrix, false, saturationMatrix);
  function updateSaturation(saturation: number) {
    if (!gl) return;
    // Saturation between -1 and 1
    const s = 1 + saturation;

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const lr = 0.2126;
    const lg = 0.7152;
    const lb = 0.0722;

    const sr = (1 - s) * lr;
    const sg = (1 - s) * lg;
    const sb = (1 - s) * lb;

    // prettier-ignore
    mat4.transpose(saturationMatrix, [
      sr + s, sg    , sb    , 0,
      sr    , sg + s, sb    , 0,
      sr    , sg    , sb + s, 0,
      0     , 0     , 0     , 1,
    ]);
    gl.uniformMatrix4fv(uSaturationMatrix, false, saturationMatrix);
  }
  /* ===== Filter - Hue ===== */
  const uHue = gl.getUniformLocation(program, 'u_hue');
  gl.uniform1f(uHue, config.Hue);
  function updateHue(hue: number) {
    if (!gl) return;
    gl.uniform1f(uHue, hue);
  }

  /* ===== Effects - Grain ===== */
  const uGrainAmount = gl.getUniformLocation(program, 'u_grain_amount');
  gl.uniform1f(uGrainAmount, config.grainAmount);

  /* ===== Effects - Pixelate ===== */
  const uPixelateAmount = gl.getUniformLocation(program, 'u_pixelate');
  gl.uniform1f(uPixelateAmount, config.pixelate);


  /* ===== Controls ===== */
  updateBrightness(config.Brightness);
  updateContrast(config.Contrast);
  updateExposure(config.Exposure);
  updateSaturation(config.Saturation);
  updateHue(config.Hue);

