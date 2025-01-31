export type AdminRole = 'default_user' | 'sub_user';
export type AdminStatus = 'active' | 'inactive';
export type AgencyStatus = 'pending' | 'active' | 'inactive' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: number;
  address: string;
  city: string;
  companyName: string;
  emailAddress: string;
  licenseExpirationDate: string;
  licenseNumber: string;
  licenseType: string;
  phoneNumber: string;
  registeredAgentName: string;
  country: string;
  state: string;
  status: string;
  zip: string;
}

export interface Admin {
  id: string;
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