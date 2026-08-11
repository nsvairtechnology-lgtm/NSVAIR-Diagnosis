import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'No id provided' }, { status: 400 })
    }
    const report = await db.diagnosisReport.findUnique({ where: { id } })
    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({
      report: {
        ...report,
        redFlags: JSON.parse(report.redFlags || '[]'),
        recommendations: JSON.parse(report.recommendations || '[]'),
        nextSteps: JSON.parse(report.nextSteps || '[]'),
        topFindings: JSON.parse(report.topFindings || '[]'),
        results: JSON.parse(report.resultsJson || '[]'),
      },
    })
  } catch (error) {
    console.error('Get report error:', error)
    return NextResponse.json({ error: 'Failed to load report' }, { status: 500 })
  }
}
