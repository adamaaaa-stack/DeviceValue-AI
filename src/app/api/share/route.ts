import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, userId, platform } = body

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }

    // Fetch device details
    const { data: device, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single()

    if (error || !device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      )
    }

    // Generate shareable link
    const shareId = Buffer.from(`${deviceId}-${Date.now()}`).toString('base64url')
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${shareId}`

    // Award clout points for sharing
    if (userId) {
      const { data: userData } = await supabase
        .from('users')
        .select('clout_score, badges')
        .eq('id', userId)
        .single()

      if (userData) {
        const shareBonus = 50 // 50 points per share
        const newCloutScore = (userData.clout_score || 0) + shareBonus
        const badges = userData.badges || []
        
        // Award "Social Butterfly" badge after 5 shares
        if (!badges.includes('social_butterfly')) {
          badges.push('social_butterfly')
        }

        await supabase
          .from('users')
          .update({
            clout_score: newCloutScore,
            badges
          })
          .eq('id', userId)
      }
    }

    // Generate share content based on platform
    const shareContent = generateShareContent(device, platform)

    return NextResponse.json({
      shareUrl,
      shareContent,
      device: {
        brand: device.brand,
        model: device.model,
        valueMin: device.ai_value_min,
        valueMax: device.ai_value_max,
        confidence: device.confidence
      }
    })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateShareContent(device: Record<string, unknown>, platform: string) {
  const valueText = device.ai_value_min && device.ai_value_max
    ? `$${device.ai_value_min} - $${device.ai_value_max}`
    : 'Check it out!'
  
  const baseText = `🔥 My ${device.brand} ${device.model} is worth ${valueText}! Valued with DeviceValue AI`
  
  switch (platform) {
    case 'twitter':
    case 'x':
      return {
        text: `${baseText} #DeviceValueAI #TechResale`,
        url: 'https://devicevalue.ai'
      }
    case 'instagram':
      return {
        text: `${baseText}\n\n📱 Know what your devices are worth!\n#DeviceValueAI #PhoneResale #TechTips`,
        url: 'https://devicevalue.ai'
      }
    case 'tiktok':
      return {
        text: `${baseText} 💰 Link in bio! #fyp #tech #resale`,
        url: 'https://devicevalue.ai'
      }
    default:
      return {
        text: baseText,
        url: 'https://devicevalue.ai'
      }
  }
}

