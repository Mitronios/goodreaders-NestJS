export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string | null;
    avatar: string | null;
  };

  constructor(
    access_token: string,
    user: {
      id: string;
      email: string;
      role: string | null;
      avatar: string | null;
    },
  ) {
    this.access_token = access_token;
    this.user = user;
  }
}
