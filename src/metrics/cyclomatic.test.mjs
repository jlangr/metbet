import { getCyclomaticComplexity } from './cyclomatic.mjs'

describe('Cyclomatic Complexity', () => {
  it('happy non-conditional path has complexity of 1', () => {
    const source = `const f = () => 42`
    expect(getCyclomaticComplexity(source)).toBe(1)
  })

  it('if adds 1', () => {
    const source = `
      const f = (count) => {
        let response = "s"
        if (count > 42)
          response += "abc"
        return response
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('if/else adds 1', () => {
    const source = `
      const f = (count) => {
        let response = "s"
        if (count > 42)
          response += "abc"
        else
          response += "xyz"
        return response
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('switch adds 1 per case/default', () => {
    const source = `
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
    expect(getCyclomaticComplexity(source)).toBe(4)
  })

  it('for loop adds 1', () => {
    const source = `
      const f = (n) => {
        let sum = 0
        for (let i = 0; i < n; i++)
          sum += i
        return sum
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('while loop adds 1', () => {
    const source = `
      const f = (n) => {
        while (n > 0) {
          console.log(n)
          n--
        }
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('do/while loop adds 1', () => {
    const source = `
      const f = (n) => {
        do {
          console.log(n)
          n--
        } while (n > 0)
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('each boolean operator adds 1', () => {
    const source = `
      const f = (a, b) => {
        if (a > 10 && b < 20)
          console.log("In range")
        else if (a > 10 || b > 20)
          console.log("Out of one range")
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(5)
  })

  it('ternary operator adds 1', () => {
    const source = `const getStatus = (age) => age >= 18 ? "Adult" : "Minor"`
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('nullish coalescing operator adds 1', () => {
    const source = `const getSetting = (input) => input ?? "default"`
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('and operator adds 1', () => {
    const source = `const check = (x, y) => x > 10 && y < 20`
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('or operator adds 1', () => {
    const source = `const validate = (input) => input == null || input === ""`
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('old school functions work', () => {
    const source = `
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
    expect(getCyclomaticComplexity(source)).toBe(10)
  })

  it('adds 1 for try/catch', () => {
    const source = `
      function compute(number) {
        try {
          return someCall(number)
        } catch (error) {
          return "Error encountered"
        }
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('does not add any for nested function', () => {
    const source = `
      const outerFunction = (data) => {
        const nestedFunction = () => console.log("Nested function executed.")
        nestedFunction()
      }
    `
    expect(getCyclomaticComplexity(source)).toBe(1)
  })

  it('outer function with internal try/catch and conditionals', () => {
    const source = `
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
    expect(getCyclomaticComplexity(source)).toBe(3)
  })

  it('recognizes nested functions in lambda form', () => {
    const source = `
      const x = n =>
        ['a', 'b', 'c']
          .map(alpha)
          .filter(s => s.length > 1)
          .map(s => s[0] === 'b' ? 1 : 2)
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('can accommodate single line formatting', () => {
    const source = `
      const x = n => ['a', 'b', 'c'].map(alpha).filter(s => s.length > 1).map(s => s[0] === 'b' ? 1 : 2)
    `
    expect(getCyclomaticComplexity(source)).toBe(2)
  })

  it('includes nested callbacks', () => {
    const source = `
      fetchData(5)
        .then(data => {
          console.log("Success:", data)
        })
        .catch(error => {
          console.error("Error:", error)
        })
    `
    expect(getCyclomaticComplexity(source)).toBe(1)
  })
})
