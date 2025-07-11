import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TagLabel, EndorsementData } from '@/types';

// Mock auth token - in production, this would come from auth context
const MOCK_AUTH_TOKEN = 'mock-jwt-token';

async function fetchEndorsements(companyId: string): Promise<EndorsementData> {
  const response = await fetch(`/api/endorse/${companyId}`, {
    headers: {
      'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch endorsements');
  }

  return response.json();
}

async function endorseCompany(companyId: string, tag: TagLabel): Promise<{ success: boolean }> {
  const response = await fetch('/api/endorse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ companyId, tag }),
  });

  if (!response.ok) {
    throw new Error('Failed to endorse company');
  }

  return response.json();
}

export function useEndorsements(companyId: string) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['endorsements', companyId],
    queryFn: () => fetchEndorsements(companyId),
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const mutation = useMutation({
    mutationFn: ({ tag }: { tag: TagLabel }) => endorseCompany(companyId, tag),
    onMutate: async ({ tag }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['endorsements', companyId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<EndorsementData>(['endorsements', companyId]);

      // Optimistically update
      if (previousData) {
        const newData: EndorsementData = {
          ...previousData,
          counts: {
            ...previousData.counts,
            [tag]: previousData.counts[tag] + 1,
            // If user had a previous tag, decrement it
            ...(previousData.userTag && previousData.userTag !== tag ? {
              [previousData.userTag]: Math.max(0, previousData.counts[previousData.userTag] - 1)
            } : {}),
          },
          userTag: tag,
          totalEndorsements: previousData.userTag ? previousData.totalEndorsements : previousData.totalEndorsements + 1,
        };

        queryClient.setQueryData(['endorsements', companyId], newData);
      }

      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(['endorsements', companyId], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['endorsements', companyId] });
    },
  });

  return {
    data,
    isLoading,
    error,
    endorse: mutation.mutate,
    isEndorsing: mutation.isPending,
    endorseError: mutation.error,
  };
}