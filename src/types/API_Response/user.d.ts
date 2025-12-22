interface UserResponse {
  id: number,
  username: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string,
  profile: ClientProfile | null;
}