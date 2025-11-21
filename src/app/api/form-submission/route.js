import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      formData, 
      pdfUrl, 
      pdfPath, 
      userId, 
      linkId 
    } = body

    // Save form submission to database
    const { data, error } = await supabase
      .from('form_submissions') // You'll need to create this table
      .insert({
        user_id: userId,
        link_id: linkId,
        form_data: formData,
        pdf_url: pdfUrl,
        pdf_storage_path: pdfPath,
        submitted_at: new Date().toISOString(),
        // Extract some key fields for easier querying
        customer_name: formData?.step1?.fullName,
        customer_phone: formData?.step1?.phoneNumber,
        monthly_income: formData?.step1?.monthlyIncome,
        life_value: formData?.step3?.actualHLValue
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      submissionId: data[0]?.id 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}