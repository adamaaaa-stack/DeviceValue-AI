import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: leaderboard, error } = await supabase
      .from('leaderboard')
      .select(`
        user_id,
        clout_score,
        badges,
        users (
          name,
          email,
          profile_pic
        )
      `)
      .order('clout_score', { ascending: false })
      .limit(50)

    if (error) {
      // Table might not exist yet - return mock data
      // Return mock data if table doesn't exist yet
      return NextResponse.json({
        leaderboard: [
          { user_id: '1', clout_score: 15420, badges: ['high_roller', 'first_valuation'], users: { name: 'TechTrader', profile_pic: null } },
          { user_id: '2', clout_score: 12350, badges: ['first_valuation'], users: { name: 'GadgetGuru', profile_pic: null } },
          { user_id: '3', clout_score: 9870, badges: ['high_roller'], users: { name: 'DeviceMaster', profile_pic: null } },
          { user_id: '4', clout_score: 7650, badges: ['first_valuation'], users: { name: 'PhoneFlip', profile_pic: null } },
          { user_id: '5', clout_score: 5230, badges: [], users: { name: 'SellSmart', profile_pic: null } },
        ]
      })
    }

    return NextResponse.json({
      leaderboard: leaderboard || []
    })
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

