import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const storage = formData.get('storage') as string | null
    const ram = formData.get('ram') as string | null
    const accessories = formData.get('accessories') as string | null
    const photo = formData.get('photo') as File | null

    if (!userId || !brand || !model) {
      return NextResponse.json(
        { error: 'User ID, brand, and model are required' },
        { status: 400 }
      )
    }

    let photoUrls: string[] = []

    // Upload photo to Supabase storage if provided
    if (photo) {
      const fileName = `${userId}/${Date.now()}-${photo.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('device-photos')
        .upload(fileName, photo)

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
      } else if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('device-photos')
          .getPublicUrl(uploadData.path)
        photoUrls = [urlData.publicUrl]
      }
    }

    // Create device record
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .insert({
        user_id: userId,
        brand,
        model,
        storage,
        ram,
        accessories,
        photos: photoUrls
      })
      .select()
      .single()

    if (deviceError) {
      return NextResponse.json(
        { error: deviceError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Device uploaded successfully',
      device
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

