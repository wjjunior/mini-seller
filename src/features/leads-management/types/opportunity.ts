export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId: string;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage = 
  | 'Prospecting'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export const STAGE_OPTIONS: OpportunityStage[] = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export interface CreateOpportunityData {
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId: string;
}

export interface OpportunityEditFormData {
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
}
