

export interface CreateCompanyRequest {
  company: CreateCompanyInput;
  email: string
  
}
export interface CreateCompanyInput {
  name: string;
}

export interface UpdateCompanyInput {
  name?: string;
  domain?: string;
}