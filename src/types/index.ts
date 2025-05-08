export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface authState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
