import { Referral } from "@/referrals/domain/referral.entity";

export type EmailTemplateData = {
  name?: string;
  referral?: Referral;
}