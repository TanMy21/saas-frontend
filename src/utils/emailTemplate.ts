import { escapeHtml, validateShareURL } from "./utils";

export const getSurveyEmailTemplate = ({
  surveyTitle,
  shareURL,
  senderName,
}: {
  surveyTitle?: string;
  shareURL: string;
  senderName?: string;
}) => {
  const safeShareURL = escapeHtml(validateShareURL(shareURL));

  const safeSurveyTitle = surveyTitle ? escapeHtml(surveyTitle) : "";
  const safeSenderName = senderName ? escapeHtml(senderName) : "";

  return `Hi,<br/><br/>

Wanted to get your thoughts${
    safeSurveyTitle ? ` on <strong>${safeSurveyTitle}</strong>` : ""
  }.<br/><br/>

It’ll only take a minute, and your feedback genuinely helps.<br/><br/>

<strong>Take the survey here:</strong><br/>
<a href="${safeShareURL}" target="_blank" rel="noopener noreferrer">${safeShareURL}</a><br/><br/>

Thanks${safeSenderName ? `,<br/><strong>${safeSenderName}</strong>` : "!"}`;
};
