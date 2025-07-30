import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('Starting builder application submission...');
    
    const formData = await request.json();
    console.log('Form data received');
    
    // DEBUG: Log what we actually received
    console.log('Available fields:', Object.keys(formData));
    console.log('Sample data:', {
      legalBusinessName: formData.legalBusinessName,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail
    });

    // Check Supabase environment variables
    console.log('Supabase URL exists:', !!process.env.SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Validate required fields (more flexible)
    const businessName = formData.legalBusinessName || formData.legal_business_name;
    const contactName = formData.contactName || formData.contact_name;
    const contactEmail = formData.contactEmail || formData.contact_email;

    console.log('Validation check:', {
      businessName: !!businessName,
      contactName: !!contactName,
      contactEmail: !!contactEmail
    });

    if (!businessName) {
      console.log('Validation failed: Missing business name');
      return NextResponse.json(
        { success: false, message: 'Legal business name is required' },
        { status: 400 }
      );
    }

    console.log('Validation passed, preparing data for Supabase...');

    // Prepare data for insertion
    const insertData = {
      // Company Information
      legal_business_name: businessName,
      dba: formData.dba || null,
      years_in_business: formData.yearsInBusiness || null,
      contractor_license: formData.contractorLicense || null,
      federal_tax_id: formData.federalTaxId || null,
      
      // Principal Contact
      contact_name: contactName || null,
      contact_title: formData.contactTitle || null,
      contact_phone: formData.contactPhone || null,
      contact_email: contactEmail,
      business_address: formData.businessAddress || null,
      city_state_zip: formData.cityStateZip || null,
      
      // Experience & Expertise
      steel_frame_experience: formData.steelFrameExperience || null,
      barndominiums_completed: formData.barndominiumsCompleted || null,
      expertise: formData.expertise || null,
      
      // Project History
      projects: formData.projects || null,
      
      // Building Standards
      building_standards: formData.buildingStandards || null,
      
      // Additional Information
      additional_info: formData.additionalInfo || null,
      
      submitted_at: new Date().toISOString()
    };

    console.log('Data prepared, inserting into Supabase...');

    const { data, error } = await supabase
      .from('builder_applications')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Database insertion successful:', data[0]?.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully! We will review your application and contact you soon.',
      id: data[0].id
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}
