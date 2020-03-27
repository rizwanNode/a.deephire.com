import { ObjectID } from 'mongodb';
import l from '../../common/logger';
import { insert, byId, put, byParam, deleteObject } from './db.service';
import { uploadS3 } from '../../common/aws';
import { auth0Managment } from '../../common/auth';
import EmailsService from './emails.service';

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const collection = 'companies';
const bucket = 'deephire.data.public';

const defaultPlan = 'basic-monthly-v1';

const getStripeId = async companyId => {
  const companyData = await byId(companyId, collection);
  const { stripeCustomerId } = companyData;
  return stripeCustomerId;
};
const listCustomerAttribute = async (companyId, type, additionalParams = {}) => {
  const stripeCustomerId = await getStripeId(companyId);
  if (!stripeCustomerId) return 404;
  return stripe[type].list(
    { customer: stripeCustomerId, ...additionalParams }).catch(err => {
    l.error(err);
    return err;
  });
};

const getSubscriptionsFromStripe = async stripeCustomerId => {
  const customer = await stripe.customers.retrieve(
    stripeCustomerId);
  const { subscriptions } = customer;
  return subscriptions;
};

const createStripeTrialCustomer = async (email, companyName) => {
  const customer = await stripe.customers.create(
    {
      email, name: companyName
    }
  ).catch(err => l.error(err));

  stripe.subscriptions.create(
    {
      customer: customer.id,
      items: [{ plan: defaultPlan }],
      trial_period_days: 7
    }).catch(err => l.error(err));

  return customer.id;
};
class CompaniesService {
  async insert(data) {
    l.info(`${this.constructor.name}.insert(${JSON.stringify(data)})`);
    const { owner, companyName } = data;
    const stripeCustomerId = await createStripeTrialCustomer(owner, companyName);
    const insertData = { ...data, stripeCustomerId };
    return insert(insertData, collection).then(r => r._id);
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
    const subscriptions = await getSubscriptionsFromStripe(stripeCustomerId);
    const { plan } = subscriptions?.data[0]?.items?.data[0] || {};
    const { product } = plan || {};
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


  async addPaymentMethod(companyId, paymentMethodId) {
    l.info(`${this.constructor.name}.addPaymentMethod(${companyId})`);
    const stripeId = await getStripeId(companyId);
    if (!stripeId) return 404;
    await stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: stripeId,
      }).catch(err => l.error(err));

    await stripe.customers.update(
      stripeId,
      { invoice_settings: { default_payment_method: paymentMethodId } }
    ).catch(err => l.error(err));

    const subscription = await getSubscriptionsFromStripe(stripeId);

    if (subscription.data[0]) {
      const subscriptionId = subscription.data[0].id;
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        { default_payment_method: paymentMethodId }
      ).catch(err => l.error(err));
      return updatedSubscription;
    }

    return stripe.subscriptions.create(
      {
        customer: stripeId,
        items: [{ plan: defaultPlan }],
      }).catch(err => l.error(err));
  }
}


export default new CompaniesService();
