import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const [
            totalLeads,
            leadsToday,
            leadsYesterday,
            leadsWithBudget,
            leadsWithBudgetYesterday,
            botPausedCount,
            recentLeads,
        ] = await Promise.all([
            Lead.countDocuments(),
            Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
            Lead.countDocuments({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }),
            Lead.countDocuments({ stage: 'DONE' }),
            Lead.countDocuments({ stage: 'DONE', lastInteraction: { $gte: startOfYesterday, $lt: startOfToday } }),
            Lead.countDocuments({ botPaused: true }),
            Lead.find()
                .sort({ lastInteraction: -1 })
                .limit(5)
                .select('name phoneNumber stage lastInteraction history')
                .lean(),
        ]);

        const conversionRate = totalLeads > 0 ? Math.round((leadsWithBudget / totalLeads) * 100) : 0;

        // Calcular variações
        const leadsGrowth = leadsYesterday > 0
            ? Math.round(((leadsToday - leadsYesterday) / leadsYesterday) * 100)
            : leadsToday > 0 ? 100 : 0;

        const budgetGrowth = leadsWithBudgetYesterday > 0
            ? Math.round(((leadsWithBudget - leadsWithBudgetYesterday) / leadsWithBudgetYesterday) * 100)
            : leadsWithBudget > 0 ? 100 : 0;

        // Distribuição por estágio
        const stageAggregation = await Lead.aggregate([
            { $group: { _id: '$stage', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return NextResponse.json({
            totalLeads,
            leadsToday,
            leadsGrowth,
            budgetsGenerated: leadsWithBudget,
            budgetGrowth,
            conversionRate,
            botPausedCount,
            recentLeads,
            stageDistribution: stageAggregation,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
