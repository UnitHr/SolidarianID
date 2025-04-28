import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Follower, Following, HistoryEntry } from '../types/user-history.types';
import { getStoredUser } from '../../services/user.service';
import { getUserByIdGraphQL } from '../../services/graphql.user.service';
import {
  fetchCausesHistory,
  fetchCommunitiesHistory,
  fetchFollowers,
  fetchFollowing,
  fetchRequestsHistory,
  fetchSupportsHistory,
} from '../../services/user-history.service';

export function useUserHistory(refreshTrigger?: boolean) {
  const navigate = useNavigate();
  const { userId: urlUserId } = useParams<{ userId: string }>();

  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState('');
  const [userBio, setUserBio] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<string | null>(null);

  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [communities, setCommunities] = useState<HistoryEntry[]>([]);
  const [causes, setCauses] = useState<HistoryEntry[]>([]);
  const [supports, setSupports] = useState<HistoryEntry[]>([]);
  const [requests, setRequests] = useState<HistoryEntry[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState({
    followingPage: 1,
    followersPage: 1,
    communitiesPage: 1,
    causesPage: 1,
    supportsPage: 1,
    requestsPage: 1,
  });

  const [totalPages, setTotalPages] = useState({
    following: 0,
    followers: 0,
    communities: 0,
    causes: 0,
    supports: 0,
    requests: 0,
  });

  const [totalCount, setTotalCount] = useState({
    following: 0,
    followers: 0,
    communities: 0,
    causes: 0,
    supports: 0,
    requests: 0,
  });

  useEffect(() => {
    async function loadUserHistory() {
      const storedUser = getStoredUser();
      if (!storedUser) {
        navigate('/login');
        return;
      }

      // Own profile or another user
      const idToUse = urlUserId || storedUser.userId;
      setEffectiveUserId(idToUse);

      try {
        const userData = await getUserByIdGraphQL(idToUse);

        setUserFullName(`${userData.firstName} ${userData.lastName}`);
        setUserBio(userData.bio || null);
        setUserEmail((userData.showEmail ?? (userData.email || null)) as string | null);
        setUserAge((userData.showAge ?? (userData.age || null)) as string | null);

        setTotalCount((prev) => ({
          ...prev,
          following: userData.followingCount,
          followers: userData.followersCount,
        }));

        const [
          followingData,
          followersData,
          communitiesData,
          causesData,
          supportsData,
          requestsData,
        ] = await Promise.all([
          fetchFollowing(idToUse, page.followingPage),
          fetchFollowers(idToUse, page.followersPage),
          fetchCommunitiesHistory(idToUse, page.communitiesPage),
          fetchCausesHistory(idToUse, page.causesPage),
          fetchSupportsHistory(idToUse, page.supportsPage),
          fetchRequestsHistory(idToUse, page.requestsPage),
        ]);

        setFollowing(followingData.data);
        setFollowers(followersData.data);
        setCommunities(communitiesData.data);
        setCauses(causesData.data);
        setSupports(supportsData.data);
        setRequests(requestsData.data);

        setTotalPages({
          following: followingData.meta.totalPages,
          followers: followersData.meta.totalPages,
          communities: communitiesData.meta.totalPages,
          causes: causesData.meta.totalPages,
          supports: supportsData.meta.totalPages,
          requests: requestsData.meta.totalPages,
        });

        setTotalCount((prev) => ({
          ...prev,
          following: followingData.meta.total,
          followers: followersData.meta.total,
          communities: communitiesData.meta.total,
          causes: causesData.meta.total,
          supports: supportsData.meta.total,
          requests: requestsData.meta.total,
        }));
      } catch (error) {
        console.error('Error loading user history:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserHistory();
  }, [navigate, urlUserId, page, refreshTrigger]);

  return {
    effectiveUserId,
    userFullName,
    userBio,
    userEmail,
    userAge,
    following,
    followers,
    communities,
    causes,
    supports,
    requests,
    totalPages,
    totalCount,
    page,
    loading,
    setPage,
  };
}
