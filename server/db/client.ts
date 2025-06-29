import { PrismaClient } from "@prisma/client";

export const client = new PrismaClient({
  log: [
    // { emit: 'stdout', level: 'query' },
    // { emit: 'stdout', level: 'info' },
    // { emit: 'stdout', level: 'warn' },
    // { emit: 'stdout', level: 'error' },
  ],
})

// client.$on('query', (e) => {
//   console.log('Query: ' + e.query)
//   console.log('Params: ' + e.params)
//   console.log('Duration: ' + e.duration + 'ms')
// })
