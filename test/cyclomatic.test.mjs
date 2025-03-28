import { getCyclomaticComplexity } from '../src/cyclomatic'

describe('Cyclomatic Complexity', () => {
  it('happy non-conditional path has complexity of 1', () => {
    const f = `const f = () => 42`
    expect(getCyclomaticComplexity(f)).toBe(1)
  })

  it('if adds 1', () => {
    const f = `
      const f = (count) => {
        let response = "s"
        if (count > 42)
          response += "abc"
        return response
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('if/else adds 1', () => {
    const f = `
      const f = (count) => {
        let response = "s"
        if (count > 42)
          response += "abc"
        else
          response += "xyz"
        return response
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('switch adds 1 per case/default', () => {
    const f = `
      const f = (value) => {
        let message = ""
        switch(value) {
          case 1:
            message = "one"
            break
          case 2:
            message = "two"
            break
          default:
            message = "other"
        }
        return message
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(4)
  })

  it('for loop adds 1', () => {
    const f = `
      const f = (n) => {
        let sum = 0
        for (let i = 0; i < n; i++)
          sum += i
        return sum
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('while loop adds 1', () => {
    const f = `
      const f = (n) => {
        while (n > 0) {
          console.log(n)
          n--
        }
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('do/while loop adds 1', () => {
    const f = `
      const f = (n) => {
        do {
          console.log(n)
          n--
        } while (n > 0)
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('each boolean operator adds 1', () => {
    const f = `
      const f = (a, b) => {
        if (a > 10 && b < 20)
          console.log("In range")
        else if (a > 10 || b > 20)
          console.log("Out of one range")
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(5)
  })

  it('ternary operator adds 1', () => {
    const f = `const getStatus = (age) => age >= 18 ? "Adult" : "Minor"`
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('nullish coalescing operator adds 1', () => {
    const f = `const getSetting = (input) => input ?? "default"`
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('and operator adds 1', () => {
    const f = `const check = (x, y) => x > 10 && y < 20 ? "Pass" : "Fail"`
    expect(getCyclomaticComplexity(f)).toBe(3)
  })

  it('or operator adds 1', () => {
    const f = `const validate = (input) => input == null || input === "" ? "Invalid" : "Valid"`
    expect(getCyclomaticComplexity(f)).toBe(3)
  })

  it('old school functions work', () => {
    const f = `\
      function analyzeData(data) {
        let result = "Initial"
        if (data.length > 10) {
          for (let i = 0; i < data.length; i++) {
            if (data[i] > 100) {
              result = data[i] % 2 === 0 ? "Even High" : "Odd High"
            } else {
              result = data[i] < 50 ? "Low" : "Medium"
              if (data[i] === 25 && (data[i - 1] ?? 0) > 20) {
                result = "Special Twenty Five"
              }
            }
          }
        } else if (data.some(val => val < 0)) {
          result = "Negative Values Present"
        } else {
          result = "Short List"
        }
        return result
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(10)
  })

  it('adds 1 for try/catch', () => {
    const f = `\
      function compute(number) {
        try {
          return someCall(number)
        } catch (error) {
          return "Error encountered"
        }
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('does not add any for nested function', () => {
    const f = `\
      const outerFunction = (data) => {
        const nestedFunction = () => console.log("Nested function executed.");
        nestedFunction();
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(1)
  })

  it('multiple control flows and nested functions', () => {
    const f = `\
      function outerFunction(data) {
        console.log("Processing data:", data)
        function nestedFunction() {
          console.log("Nested function executed.")
        }
        nestedFunction()
        try {
          if (data < 0) {
            throw new Error("Negative data not allowed")
          }
          console.log("Data is positive.")
        } catch (error) {
          console.error("Error:", error.message)
        }
      }
    `
    expect(getCyclomaticComplexity(f)).toBe(3)
  })

  it('recognizes nested functions in lambda form', () => {
    const f = `\
      const x = n =>
        ['a', 'b', 'c']
          .map(alpha)
          .filter(s => s.length > 1)
          .map(s => s[0] === 'b' ? 1 : 2)
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('can accommodate single line formatting', () => {
    const f = `
      const x = n => ['a', 'b', 'c'].map(alpha).filter(s => s.length > 1).map(s => s[0] === 'b' ? 1 : 2)
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })

  it('includes nested callbacks', () => {
    const f = `\
      fetchData(5)
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => n ?? 1 );
    `
    expect(getCyclomaticComplexity(f)).toBe(2)
  })
})
