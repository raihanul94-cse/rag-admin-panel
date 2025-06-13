export type AdminRole = 'default_user' | 'sub_user';
export type AdminStatus = 'active' | 'inactive';
export type CompanyStatus = 'pending' | 'active' | 'inactive' | 'rejected';

export interface Profile {
  uuid: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
  updated_at: string;
}

export interface Company {
  uuid: string;
  address: string;
  city: string;
  companyName: string;
  emailAddress: string;
  licenseExpirationDate: string;
  licenseNumber: string;
  licenseType: string;
  phoneNumber: string;
  registeredAgentFirstName: string;
  registeredAgentLastName: string;
  country: string;
  state: string;
  status: string;
  zip: string;
  userEmailAddress?: string;
  password?: string;
}

export interface Admin {
  uuid: string;
  emailAddress: string;
  role: string;
  status: string;
}

export interface Tokens {
  access: {
    token: string;
    expires: number;
  };
  refresh: {
    token: string;
    expires: number;
  };
}