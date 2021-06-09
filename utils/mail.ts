import {useEffect, useState} from "react"
import {MailsForEvent} from "../types/mail"
import {getMailsForEvent, updateMailsForEvent} from "./api/mail"

export const useMailsForEvent = (eventUUID: string) => {
  const [mailsForEvent, setMailsForEvent] = useState<MailsForEvent|null>(null)
  const [error, setError] = useState<string|null>(null)
  const update = async (newMailsForEvent: MailsForEvent) => {
    const result = await updateMailsForEvent(newMailsForEvent)
    if (result.ok) {
      setMailsForEvent(result.data)
    } else {
      setError("Failed to update the mailsForEvent.")
    }
    return result
  }
  useEffect(() => {
    getMailsForEvent(eventUUID)
      .then(result => {
        if (result.ok) {
          setMailsForEvent(result.data)
        } else {
          setError(result.description)
        }
      })
  }, [])

  return {mailsForEvent, error, update}
}