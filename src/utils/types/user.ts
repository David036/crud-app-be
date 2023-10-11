export interface CreateUserRequestBody {
  id: string;
  name: string;
  surname: string;
  age: number;
}

export interface GetUsersResponse {
  success?: boolean;
  data?: CreateUserRequestBody[];
}
