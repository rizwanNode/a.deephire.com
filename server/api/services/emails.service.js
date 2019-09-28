import l from '../../common/logger';

const mandrill = require('mandrill-api/mandrill');

const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

const sendTemplate = opts =>
  new Promise((resolve, reject) => {
    mandrillClient.messages.sendTemplate(opts, resolve, reject);
  });

class EmailService {
  async send(msgRecipents, templateName, mergeTags) {
    l.info(
      `${this.constructor.name}.send(${msgRecipents}, ${templateName}, ${JSON.stringify(
        mergeTags,
      )})`,
    );

    const recipents = Array.isArray(msgRecipents) ? msgRecipents : [msgRecipents];
    const to = recipents.map(email => ({ email }));
    const vars = Object.keys(mergeTags).map(key => ({ name: key, content: mergeTags[key] }));
    const mergeVars = recipents.map(rcpt => ({ rcpt, vars }));
    const message = {
      to,
      headers: {
        'Reply-To': 'russell@deephire.com',
      },
      important: false,
      track_opens: true,
      track_clicks: true,
      auto_text: null,
      auto_html: null,
      inline_css: null,
      url_strip_qs: null,
      preserve_recipients: false,
      view_content_link: null,
      tracking_domain: null,
      signing_domain: null,
      return_path_domain: null,
      merge: true,
      merge_language: 'mailchimp',
      merge_vars: mergeVars,
      tags: ['candidate-completed-interview-test'],
    };

    return sendTemplate({
      template_name: templateName,
      template_content: null,
      message,
    })
      .then(result => result)
      .catch(e => e);
  }
}

export default new EmailService();
