export default delay => input =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(input)
    }, delay)
  })

