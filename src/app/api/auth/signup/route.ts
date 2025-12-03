import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || email.split('@')[0] }
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user profile in database
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          name: name || email.split('@')[0],
          clout_score: 0,
          badges: []
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }

      // Initialize leaderboard entry
      await supabase
        .from('leaderboard')
        .insert({
          user_id: data.user.id,
          clout_score: 0,
          badges: []
        })
    }

    return NextResponse.json({
      message: 'Signup successful',
      user: data.user
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

