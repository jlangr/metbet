export const createFiles = (prodFiles, testFiles) => ({
  prodFiles,
  testFiles,
  equals: other =>
    JSON.stringify(prodFiles) === JSON.stringify(other.prodFiles) &&
    JSON.stringify(testFiles) === JSON.stringify(other.testFiles)
})
