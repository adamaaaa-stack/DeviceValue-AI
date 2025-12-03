import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeDevice } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, brand, model, storage, ram, accessories, photoBase64 } = body

    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Brand and model are required' },
        { status: 400 }
      )
    }

    // Call Gemini AI for analysis
    let analysis
    try {
      analysis = await analyzeDevice({
        brand,
        model,
        storage,
        ram,
        accessories,
        photoBase64
      })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get valuation' },
        { status: 500 }
      )
    }

    // Update device record if deviceId provided
    if (deviceId) {
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          ai_value_min: analysis.valueMin,
          ai_value_max: analysis.valueMax,
          confidence: analysis.confidence,
          damage_analysis: JSON.stringify(analysis.damageAnalysis),
          suggested_listing: analysis.suggestedListing
        })
        .eq('id', deviceId)

      if (updateError) {
        console.error('Device update error:', updateError)
      }

      // Create history record
      await supabase
        .from('history')
        .insert({
          device_id: deviceId,
          valuation_result: analysis,
          date: new Date().toISOString()
        })
    }

    return NextResponse.json({
      message: 'Valuation complete',
      analysis
    })
  } catch (error) {
    console.error('Valuation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

