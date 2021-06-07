import {get, post, put} from "./api"

export type APIMailTemplate = {
  uuid: string,
  name: string,
  template: string,
}

export const convertAPIMailTemplateToMailTemplate = (apiMailTemplate: APIMailTemplate): MailTemplate => {
  return {
    ...apiMailTemplate,
    isSaved: true,
    isEdited: false,
  }
}

export const getMailTemplates = async (): Promise<SuccessWithData<MailTemplate[]>|Failure> => {
  const result = await get<APIMailTemplate[]>("mail-templates/")
  if (result.ok) {
    return {
      ...result,
      data: result.data.map(template => convertAPIMailTemplateToMailTemplate(template))
    }
  }
  return result
}

export const createMailTemplate = async (mailTemplate: MailTemplate): Promise<SuccessWithData<MailTemplate>|Failure> => {
  const result = await post<APIMailTemplate>("mail-templates/", mailTemplate)
  if (result.ok) {
    return {
      ...result,
      data: convertAPIMailTemplateToMailTemplate(result.data
      )
    }
  }
  return result
}

export const updateMailTemplate = async (mailTemplate: MailTemplate): Promise<SuccessWithData<MailTemplate>|Failure> => {
  const result = await put<APIMailTemplate>(`mail-templates/${mailTemplate.uuid}/`, mailTemplate)
  if (result.ok) {
    return {
      ...result,
      data: convertAPIMailTemplateToMailTemplate(result.data)
    }
  }
  return result
}
