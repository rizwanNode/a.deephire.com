const getMessage = (
  type,
  {
    interviewName,
    shortUrl,
    candidateName,
    candidateEmail,
    recruiterEmail,
    id,
    clientEmail,
    clientName,
    videosId,
  },
) => {
  const emails = {
    shortListViewed: {
      subject: `${clientEmail} viewed your shortlist`,
      text: `A shortlist has been viewed!
Name: ${clientName}
Client email: ${clientEmail}
View Anaytics: https://recruiter.deephire.com/shortlists/shortlistanalytics/?id=${id}
      `,
    },
    interviewCreated: {
      subject: `Interview ${interviewName} Created`,
      text: `Thanks for creating a video interview. You are one step closer to placing better hires, faster

Interview name: ${interviewName}
Your interview link: ${shortUrl}

Send this link to candidates for them to take your interview. Reply to this email if you have any questions!`,
    },
    interviewCompleted: {
      subject: `DeepHire - ${candidateName} finished their interview`,
      text: `Interview name: ${interviewName}
Candidate name: ${candidateName}
Candidate email: ${candidateEmail}
Check them out on: https://recruiter.deephire.com/candidates/view-candidate/?id=${videosId}`,
    },

    jobSeekerCompleted: {
      subject: `Hi ${candidateName} your video interview has been submitted.`,
      text: `Hey ${candidateName}, I wanted to let you know that your video interview has been submitted successfully. If you have any feedback about the process, please reply to this email!`,
    },
    loginEvent: {
      subject: `${recruiterEmail} clicked "login"`,
      text: `${recruiterEmail} clicked login on recruiter.deephire.com/login`,
    },
  };

  return emails[type];
};

export default getMessage;
