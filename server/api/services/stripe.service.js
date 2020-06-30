import CompaniesService from './companies.service';
import l from '../../common/logger';


const stripe = require('stripe')(process.env.STRIPE_API_KEY);

export const getStripeId = async companyId => {
  const companyData = await CompaniesService.byId(companyId, 'companies');
  const { stripeCustomerId } = companyData;
  return stripeCustomerId;
};
export const listCustomerAttribute = async (companyId, type, additionalParams = {}) => {
  const stripeCustomerId = await getStripeId(companyId);
  if (!stripeCustomerId) return 404;
  return stripe[type].list(
    { customer: stripeCustomerId, ...additionalParams }).catch(err => {
    l.error(err);
    return err;
  });
};

export const getSubscriptionsFromStripe = async stripeCustomerId => {
  const customer = await stripe.customers.retrieve(
    stripeCustomerId);
  const { subscriptions } = customer;
  return subscriptions;
};

export const createStripeTrialCustomer = async (email, companyName, plan, price) => {
  const customer = await stripe.customers.create(
    {
      email, name: companyName
    }
  ).catch(err => l.error(err));

  stripe.subscriptions.create(
    {
      customer: customer.id,
      items: [{ plan }, { price }],
      cancel_at_period_end: true,
      trial_period_days: 7
    }).catch(err => l.error(err));

  return customer.id;
};


export const stripeAddMinutes = async (companyId, quantity) => {
  const stripeId = await getStripeId(companyId);
  const subscriptions = await getSubscriptionsFromStripe(stripeId);
  const subscriptionItems = subscriptions?.data[0]?.items?.data;
  if (subscriptionItems) {
    // eslint-disable-next-line camelcase
    const meteredSi = subscriptionItems.find(si => si?.plan?.usage_type === 'metered');
    return stripe.subscriptionItems.createUsageRecord(
      meteredSi.id,
      { quantity, timestamp: Math.floor(Date.now() / 1000) });
  }
  return 'No Plan Found';
};

