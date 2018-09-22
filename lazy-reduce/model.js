const API_URL = 'http://localhost:3030/'

let fetchEmployeesChunk = ({ pageSize, pageIdx, count }) => {
  const queryString = [
    pageSize ? `_limit=${pageSize}`: undefined,
    pageIdx ? `_page=${pageIdx}`: undefined,
  ].filter(b => b).join('&')
  return fetch(`${API_URL}employees${ count ? '/count' : '' }${queryString ? '?' + queryString: ''}`)
    .then(res => res.json())
}

// mock turned ON
const randomDelay = () => 500 + Math.random() * 1000
const delayPromise = (value) => new Promise((res) => {
  setTimeout(() => res(value), randomDelay())
})  
// real API (see `itcorpo-api` repo) serves at most 50 items per page
// here we have to simulate this behavior with mocks
fetchEmployeesChunk = async ({ pageSize, pageIdx, count }) => {
  const mockEmployees = await fetch('employees.json')
    .then(res => res.json())
  if (count) {
    return delayPromise(mockEmployees.length)
  } else {
    const result = mockEmployees.slice(pageSize * pageIdx, pageSize * (pageIdx + 1))
    return delayPromise(result)
  }
}

async function processEmployees(pageSize, cb){
  const count = await fetchEmployeesChunk({ count: true })
  for (let pageIdx = 0; pageIdx * pageSize < count; pageIdx++){
    const chunk = await fetchEmployeesChunk({ pageSize, pageIdx })
    cb(chunk, (pageIdx + 1) * pageSize / count)
  }
}

// processEmployees(pageSize, (chunk) => console.log(chunk.reduce(groupByNationality, {})))
//   .then(console.log)
