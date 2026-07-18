import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(value) {
  return typeof value === 'string' && UUID_REGEX.test(value)
}

export async function GET(request, { params }) {
  try {
    const { linkId } = await params

    if (!isValidUUID(linkId)) {
      return Response.json(
        { success: false, error: 'Invalid link ID format' },
        { status: 400 }
      )
    }

    // Check if link exists and is active
    const { data: linkData, error: linkError } = await supabase
      .from('form_link')
      .select('*')
      .eq('link_id', linkId)
      .eq('status', 'active')
      .single()

    if (linkError || !linkData) {
      return Response.json(
        {
          success: false,
          error: 'Invalid or expired link',
        },
        { status: 404 }
      )
    }

    // Check if link is expired
    if (new Date(linkData.expiry_date) < new Date()) {
      return Response.json(
        {
          success: false,
          error: 'Link has expired',
        },
        { status: 410 }
      )
    }

    // Get existing form data if any
    const { data: formData } = await supabase
      .from('need_analysis_form')
      .select('*')
      .eq('link_id', linkId)
      .single()

    return Response.json(
      {
        success: true,
        linkData,
        formData: formData || null,
      },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { linkId } = await params

    if (!isValidUUID(linkId)) {
      return Response.json(
        { success: false, error: 'Invalid link ID format' },
        { status: 400 }
      )
    }

    const { step, data, user_id } = await request.json()

    // Verify link is valid
    const { data: linkData, error: linkError } = await supabase
      .from('form_link')
      .select('*')
      .eq('link_id', linkId)
      .eq('status', 'active')
      .single()

    if (linkError || !linkData) {
      return Response.json(
        { success: false, error: 'Invalid link' },
        { status: 404 }
      )
    }

    // Check if link is expired (write path must enforce this too, not just GET)
    if (new Date(linkData.expiry_date) < new Date()) {
      return Response.json(
        { success: false, error: 'Link has expired' },
        { status: 410 }
      )
    }

    // Check if form entry already exists
    const { data: existingForm } = await supabase
      .from('need_analysis_form')
      .select('form_id')
      .eq('link_id', linkId)
      .single()

    let result

    if (existingForm) {
      // Update existing form based on step
      let updateData = {}

      if (step === 'step1') {
        updateData = {
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth,
          spouse_name: data.spouseName,
          address: data.address,
          phone_number: data.phoneNumber,
          number_of_children: data.numberOfChildren,
          children_ages: data.childrenAges,
          occupation: data.occupation,
          age: data.age,
          monthly_income: data.monthlyIncome,
        }
      } else if (step === 'step2') {
        const insuranceNeeds = Object.entries(data.insuranceNeeds)
          .filter(([_, value]) => value)
          .map(([key, _]) => key)

        const healthCovers = Object.entries(data.healthCovers)
          .filter(([_, value]) => value)
          .map(([key, _]) => key)

        updateData = {
          insurance_needs: insuranceNeeds,
          health_covers: healthCovers,
        }
      } else if (step === 'step3') {
        updateData = {
          human_life_value: data.actualHLValue || 0,
          status: data.completed ? 'completed' : 'pending',
        }
      }
      // step4 has no fields of its own to persist: step3 already flips
      // status to "completed", and step4 is just the success/summary screen.

      const { data: updatedData, error } = await supabase
        .from('need_analysis_form')
        .update(updateData)
        .eq('link_id', linkId)
        .select()

      if (error) throw error
      result = updatedData
    } else {
      // Create new form entry (only for step1)
      if (step === 'step1') {
        const { data: insertData, error } = await supabase
          .from('need_analysis_form')
          .insert({
            link_id: linkId,
            user_id: user_id,
            full_name: data.fullName,
            date_of_birth: data.dateOfBirth,
            spouse_name: data.spouseName,
            address: data.address,
            phone_number: data.phoneNumber,
            number_of_children: data.numberOfChildren,
            children_ages: data.childrenAges,
            occupation: data.occupation,
            age: data.age,
            monthly_income: data.monthlyIncome,
            status: 'pending',
          })
          .select()

        if (error) throw error
        result = insertData
      } else {
        return Response.json(
          {
            success: false,
            error: 'Form must be started from step 1',
          },
          { status: 400 }
        )
      }
    }

    return Response.json({ success: true, data: result })
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
