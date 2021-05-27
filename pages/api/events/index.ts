import { NextApiRequest, NextApiResponse } from 'next'
import sampleEvent from "./sampleEvent.json"

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json(sampleEvent)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
