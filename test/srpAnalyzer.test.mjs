import {analyzeModule, normalize} from '../src/srpAnalyzer.mjs';

describe('SRP Analyzer', () => {
  it('scores very simple, pure functions highly', () => {
    const code = `
    function identity(x) { return x; }
    const triple = n => { return n * 3; };
  `;
    const result = analyzeModule(code);
    expect(result.moduleScore).toBeGreaterThan(85);
    expect(result.functions.length).toBe(2);
  });

  it('calculates complexity', () => {
    const code = `
    function ifelse(x) {
      if (x > 100) return x;
      else if (x > 90) return x - 1;
      else if (x > 80) return x - 2;
      return 0;
    }
  `;
    const result = analyzeModule(code);
    const fn = result.functions[0];
    expect(fn.complexity).toBe(4);
    expect(fn.score).toBeGreaterThan(0.8);
  });

  it('penalizes mutation', () => {
    const code = `
      let count = 0;
      function increment() {
        count += 1;
      }
    `;
    const result = analyzeModule(code);
    const fn = result.functions[0];
    expect(fn.purity).toBe(0);
    expect(fn.score).toBeLessThan(0.8);
  });

  it('handles empty input', () => {
    const result = analyzeModule('');
    expect(result.moduleScore).toBe(0);
    expect(result.functions.length).toBe(0);
  });
});

describe('normalize', () => {
  it('returns 1 when val is 0', () => {
    expect(normalize(0, 100)).toBe(1);
  });

  it('returns 0.5 when val is half of max', () => {
    expect(normalize(50, 100)).toBe(0.5);
  });

  it('returns 0 when val equals max', () => {
    expect(normalize(100, 100)).toBe(0);
  });

  it('returns 0 when val exceeds max', () => {
    expect(normalize(150, 100)).toBe(0);
  });

  it('caps the value at 1 if val is negative', () => {
    expect(normalize(-50, 100)).toBe(1);
  });

  it('returns NaN when max is 0', () => {
    expect(normalize(50, 0)).toBeNaN();
  });

  it('returns NaN when val and max are both 0', () => {
    expect(normalize(0, 0)).toBeNaN();
  });
});

describe('normalize', () => {
  it('x', () => {
    const max = 10
    expect(normalize(20, max)).toBe(10);
  })

})
