import process from 'node:process'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return $fetch.raw('/chat/completions', {
    baseURL: process.env.AI_OPEN_ROUTER_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.AI_OPEN_ROUTER_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
    responseType: 'stream',
  })
})
