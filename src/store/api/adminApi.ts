import { apiSlice } from './apiSlice';
import { mockData, mockUsers, MockUser } from '@/lib/mockData';

interface Role {
  id: string;
  name: string;
  description: string;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<MockUser[], void>({
      queryFn: async () => {
        try {
          const data = await mockData.getAllUsers();
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['User'],
    }),
    getAllRoles: builder.query<Role[], void>({
      queryFn: async () => {
        try {
          const data = await mockData.getAllRoles();
          return { data };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Role'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllRolesQuery,
} = adminApi;

