import { create } from 'zustand';
import { executionService } from '@/src/services/execution.service';

/**
 * History Store
 * 
 * Manages past job runs, including server-side pagination, sorting, and filtering state.
 */
export const useHistoryStore = create((set, get) => ({
  executionHistory: [],
  isLoadingHistory: false,
  
  // Pagination State
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },

  // Filter State
  filters: {
    language: '',
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },

  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters },
    // Reset page to 1 when filters change
    pagination: { ...state.pagination, page: 1 }
  })),

  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  fetchHistory: async () => {
    try {
      set({ isLoadingHistory: true });
      const { pagination, filters } = get();
      
      const response = await executionService.getHistory({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      set({ 
        executionHistory: response.data,
        pagination: response.pagination,
        isLoadingHistory: false 
      });
    } catch (error) {
      console.error('Failed to fetch history', error);
      set({ isLoadingHistory: false });
    }
  },

  deleteHistoryItem: async (jobId) => {
    try {
      // Optimistic delete
      set((state) => ({
        executionHistory: state.executionHistory.filter(job => job.id !== jobId)
      }));
      await executionService.deleteHistory(jobId);
      // Re-fetch to ensure pagination is perfectly aligned
      get().fetchHistory();
    } catch (error) {
      console.error('Failed to delete history', error);
      get().fetchHistory(); // Revert optimistic delete on fail
    }
  },

  clearHistory: () => set({ executionHistory: [] })
}));
