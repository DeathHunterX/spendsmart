export interface Account {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: string | null;
  password?: string;
  image?: string | null;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}
