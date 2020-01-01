import { ObjectID } from 'mongodb';
import l from '../../common/logger';
import { insert, byId, put, byParam, deleteObject } from './db.service';
import { uploadS3 } from '../../common/aws';
import { auth0Managment } from '../../common/auth';
import EmailsService from './emails.service';

const stripe = require('stripe')(process.env.STRIPE_API_KEY);


const collection = 'companies';
const bucket = 'deephire.data.public';


const listCustomerAttribute = async (companyId, type, additionalParams = {}) => {
  const companyData = await byId(companyId, collection);
  const { stripeCustomerId } = companyData;
  if (!stripeCustomerId) return 404;
  return stripe[type].list(
    { customer: stripeCustomerId, ...additionalParams });
};
class CompaniesService {
  insert(data) {
    l.info(`${this.constructor.name}.insert(${JSON.stringify(data)})`);
    return insert(data, collection).then(r => r._id);
  }

  byId(companyId) {
    l.info(`${this.constructor.name}.byId(${companyId})`);
    return byId(companyId, collection);
  }

  byIdPublic(companyId) {
    l.info(`${this.constructor.name}.byIdPublic(${companyId})`);
    return byId(companyId, collection, true).then(r => {
      if (r.clockworkIntegration) {
        // eslint-disable-next-line no-param-reassign
        delete r.clockworkIntegration.key;
        return r;
      }
      return r;
    });
  }

  async putLogo(companyId, files) {
    l.info(`${this.constructor.name}.putLogo(${JSON.stringify(files)})`);
    const { upfile } = files;
    const { path, originalname: originalName } = upfile;
    const key = `companies/${companyId}/${originalName}`;

    uploadS3(bucket, key, path, 'public-read');
    const data = {
      logo: `https://s3.amazonaws.com/${bucket}/${key}`
    };
    return put(companyId, collection, data, true);
  }

  async put(companyId, data) {
    l.info(`${this.constructor.name}.put(${companyId}`);
    return put(companyId, collection, data, true);
  }

  async getInvites(companyId) {
    l.info(`${this.constructor.name}.getInvites(${companyId}`);
    return byParam({ companyId: new ObjectID(companyId) }, 'companies_invites');
  }

  async getTeam(companyId) {
    l.info(`${this.constructor.name}.getTeam(${companyId}`);
    const team = await auth0Managment.getUsers({
      q: `app_metadata.companyId:${companyId}`
    });
    return team;
  }

  async sendInvites(companyId, userProfile, data) {
    l.info(
      `${this.constructor.name}.sendInvites(${companyId}, ${JSON.stringify(
        userProfile
      )}, ${JSON.stringify(data)})`
    );

    const { invitedEmail } = data;
    const { email: createdBy, name: createdByName } = userProfile;
    const companyData = await byId(companyId, collection, true);
    const { companyName } = companyData;
    const inviteData = {
      ...data,
      companyId: new ObjectID(companyId),
      createdBy,
      inviteStats: 'pending',
      companyName,
      createdByName
    };


    const inviteId = await insert(inviteData, 'companies_invites').then(r => r._id);
    const emailData = { ...inviteData, inviteUrl: `https://recruiter.deephire.com/user/login?invited=${inviteId}` };
    EmailsService.send([invitedEmail], 'deephire-team-invitation', emailData);
    return inviteId;
  }

  async deleteInvite(companyId, inviteId) {
    l.info(`${this.constructor.name}.deleteInvite(${companyId}, ${inviteId})`);
    return deleteObject(inviteId, 'companies_invites', { companyId: new ObjectID(companyId) });
  }

  async deleteTeamMember(companyId, teamMemberId) {
    l.info(`${this.constructor.name}.deleteInvite(${companyId}, ${teamMemberId})`);
    const user = await auth0Managment.getUser({
      id: teamMemberId
    });
    // eslint-disable-next-line camelcase
    if (user?.app_metadata?.companyId === companyId) {
      return auth0Managment.updateAppMetadata({
        id: teamMemberId
      }, { oldCompanyId: companyId, companyId: null }
      );
    }
    return 404;
  }

  async resendInvite(companyId, userProfile, inviteId) {
    l.info(`${this.constructor.name}.resendInvite(${companyId}, ${inviteId})`);
    const invite = await this.getInviteById(inviteId);
    if (invite === 400 || invite === 404) return invite;
    const { invitedEmail, role } = invite;
    deleteObject(inviteId, 'companies_invites', { companyId: new ObjectID(companyId) });
    return this.sendInvites(companyId, userProfile, { invitedEmail, role });
  }


  async getInviteById(inviteId) {
    l.info(`${this.constructor.name}.getInviteById(${inviteId})`);
    return byId(inviteId, 'companies_invites');
  }

  async getProduct(companyId) {
    l.info(`${this.constructor.name}.getProduct(${companyId})`);
    const companyData = await byId(companyId, collection);
    const { stripeCustomerId } = companyData;
    if (!stripeCustomerId) return 404;
    const customer = await stripe.customers.retrieve(
      stripeCustomerId);
    const { subscriptions } = customer;
    const { plan } = subscriptions?.data[0]?.items?.data[0];
    const { product } = plan;
    if (!product) return 404;
    const productData = await stripe.products.retrieve(
      product);
    return productData;
  }


  async getInvoices(companyId) {
    l.info(`${this.constructor.name}.getInvoices(${companyId})`);
    return listCustomerAttribute(companyId, 'invoices');
  }


  async getSubscriptions(companyId) {
    l.info(`${this.constructor.name}.getSubscriptions(${companyId})`);
    return listCustomerAttribute(companyId, 'subscriptions');
  }

  async getPaymentMethods(companyId) {
    l.info(`${this.constructor.name}.getPaymentMethods(${companyId})`);
    return listCustomerAttribute(companyId, 'paymentMethods', { type: 'card' });
  }
}


export default new CompaniesService();
