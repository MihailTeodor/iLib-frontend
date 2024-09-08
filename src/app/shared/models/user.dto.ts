export interface UserDTO {
  id?: number;  
  email: string;
  plainPassword?: string;
  name: string;
  surname: string;
  address?: string;
  telephoneNumber: string;
}