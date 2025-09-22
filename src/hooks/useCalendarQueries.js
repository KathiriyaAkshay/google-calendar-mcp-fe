import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import calendarService from '../service/calendarService';

/**
 * Custom hooks for calendar operations using TanStack Query
 */

/**
 * Hook to fetch all events
 * @param {Object} options - Query options
 * @returns {Object} - Query result
 */
export const useEvents = (options = {}) => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => calendarService.getEvents(),
    ...options,
  });
};

/**
 * Hook to fetch a specific event
 * @param {string} eventId - Event ID
 * @param {Object} options - Query options
 * @returns {Object} - Query result
 */
export const useEvent = (eventId, options = {}) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => calendarService.getEvent(eventId),
    enabled: !!eventId,
    ...options,
  });
};

/**
 * Hook to create a new event
 * @returns {Object} - Mutation result
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData) => calendarService.createEvent(eventData),
    onSuccess: () => {
      // Invalidate events query to refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook to update an event
 * @returns {Object} - Mutation result
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, eventData }) => calendarService.updateEvent(eventId, eventData),
    onSuccess: (_, variables) => {
      // Invalidate specific event query
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook to delete an event
 * @returns {Object} - Mutation result
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventId) => calendarService.deleteEvent(eventId),
    onSuccess: () => {
      // Invalidate events query to refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook to fetch all calendars
 * @param {Object} options - Query options
 * @returns {Object} - Query result
 */
export const useCalendars = (options = {}) => {
  return useQuery({
    queryKey: ['calendars'],
    queryFn: () => calendarService.getCalendars(),
    ...options,
  });
};

/**
 * Hook to sync calendar events
 * @returns {Object} - Mutation result
 */
export const useSyncEvents = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => calendarService.syncEvents(),
    onSuccess: () => {
      // Invalidate events query to refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
