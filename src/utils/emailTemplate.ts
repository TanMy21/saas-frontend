export const getSurveyEmailTemplate = ({
  surveyTitle,
  shareURL,
  senderName,
}: {
  surveyTitle?: string;
  shareURL: string;
  senderName?: string;
}) => {
  return `Hi,<br/><br/>

Wanted to get your thoughts${
    surveyTitle ? ` on <strong>${surveyTitle}</strong>` : ""
  }.<br/><br/>

It’ll only take a minute, and your feedback genuinely helps.<br/><br/>

<strong>Take the survey here:</strong><br/>
<a href="${shareURL}" target="_blank">${shareURL}</a><br/><br/>

Thanks${senderName ? `,<br/><strong>${senderName}</strong>` : "!"}`;
};
