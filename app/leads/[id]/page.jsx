import { notFound } from 'next/navigation';
import LeadOperationalForm from '@/components/LeadOperationalForm';
import LeadSummaryCard from '@/components/LeadSummaryCard';
import { getLeadById } from '@/lib/leads';

export default async function LeadDetailPage({ params }) {
  const lead = await getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="detail-layout">
      <LeadSummaryCard lead={lead} />
      <LeadOperationalForm lead={lead} />
    </div>
  );
}
