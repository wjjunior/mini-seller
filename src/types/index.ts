export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "disqualified";
}

export interface Opportunity {
  id: string;
  name: string;
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  amount?: number;
  accountName: string;
  createdAt: string;
}
