
class Emails {
  interviewCreated({ interviewName, shortUrl }) {
    return { subject: 'no',
      text: `Thanks for creating a video interview. You are one step closer to placing better hires, faster

Interview name: ${interviewName}
Your interview link: ${shortUrl}

Send this link to candidates for them to take your interview. Reply to this email if you have any questions!`,
    };
  }
}


// interviewCompleted = ({ interviewName, candidateName, candidateEmail, id }) => ({ subject: `DeepHire - ${candidateName} finished their interview`,
//   text: `Interview name: ${interviewName}
// Candidate name: ${candidateName}
// Candidate email: ${candidateEmail}
// Check them out on: https://recruiter.deephire.com/candidates/candidates/${id}` });


// jobSeekerCompleted = ({ candidateName }) => ({
//   subject: `Hi ${candidateName} your video interview has been submitted.`,
//   text: `Hey ${candidateName}, I wanted to let you know that your video interview has been submitted successfully. If you have any feedback about the process, please reply to this email!`,
// });


// loginEvent = ({ recruiterEmail }) => ({
//   subject: `${recruiterEmail} clicked "login"`,
//   text: `${recruiterEmail} clicked login on recruiter.deephire.com/login`,
// });
// }

export default new Emails();
