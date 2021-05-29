import l from '../../common/logger';
import { auth0Managment, myCache } from '../../common/auth';

// eslint-disable-next-line import/prefer-default-export
export async function updateAppMetadata(teamMemberId, appMetaData, companyId, cacheKey) {
  l.info(
    `profiles.updateAppMetadata(${teamMemberId}, ${JSON.stringify(appMetaData)}, ${companyId})`
  );

  const user = await auth0Managment.getUser({
    id: teamMemberId,
  });

  // eslint-disable-next-line camelcase
  if (user?.app_metadata?.companyId !== companyId) return null;

  const updatedUserData = await auth0Managment.updateAppMetadata(
    {
      id: teamMemberId,
    },
    { ...appMetaData }
  );

  myCache.del(cacheKey);

  return updatedUserData;
}
