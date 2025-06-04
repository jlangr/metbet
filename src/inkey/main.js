const noteElem = document.getElementById('note');
const centsElem = document.getElementById('cents');
const statusElem = document.getElementById('status');
const keySelect = document.getElementById('key');

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const getNote = freq => {
  const A4 = 440;
  const n = 12 * Math.log2(freq / A4);
  const noteIndex = Math.round(n) + 57;
  const name = noteNames[noteIndex % 12];
  const octave = Math.floor(noteIndex / 12);
  const cents = Math.floor((n - Math.round(n)) * 100);
  return { name, octave, cents };
};

const getKeyNotes = key => {
  const majorScale = [0, 2, 4, 5, 7, 9, 11];
  const rootIndex = noteNames.indexOf(key);
  return majorScale.map(i => noteNames[(i + rootIndex) % 12]);
};

const autoCorrelate = (buf, sampleRate) => {
  const SIZE = buf.length;
  let bestOffset = -1, bestCorr = 0;
  for (let offset = 8; offset < SIZE / 2; offset++) {
    let corr = 0;
    for (let i = 0; i < SIZE / 2; i++) {
      corr += buf[i] * buf[i + offset];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestOffset = offset;
    }
  }
  if (bestCorr > 0.01) {
    return sampleRate / bestOffset;
  }
  return null;
};

const update = freq => {
  if (!freq || freq < 80 || freq > 1000) return;

  const { name, octave, cents } = getNote(freq);
  const keyNotes = getKeyNotes(keySelect.value);

  noteElem.textContent = `Note: ${name}${octave}`;
  centsElem.textContent = `Cents off: ${cents}`;
  statusElem.textContent = keyNotes.includes(name) ? '🎯 In Key' : '❌ Out of Key';
};

const start = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new AudioContext();
  const mic = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  mic.connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  const loop = () => {
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, audioCtx.sampleRate);
    update(freq);
    requestAnimationFrame(loop);
  };
  loop();
};

start();
