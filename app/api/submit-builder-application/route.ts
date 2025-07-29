import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Project {
  location: string;
  squareFootage: string;
  completionDate: string;
  projectValue: string;
  referenceContact: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('Starting builder application submission...');
    
    const formData = await request.json();
    console.log('Form data received');

    // Validate required fields
    if (!formData.legalBusinessName || !formData.contactName || !formData.contactEmail) {
      return NextResponse.json(
        { success: false, message: 'Legal business name, contact name, and contact email are required' },
        { status: 400 }
      );
    }

    console.log('Saving to Supabase database...');
    const { data, error } = await supabase
      .from('builder_applications')
      .insert([
        {
          // Company Information
          legal_business_name: formData.legalBusinessName,
          dba: formData.dba,
          years_in_business: formData.yearsInBusiness,
          contractor_license: formData.contractorLicense,
          federal_tax_id: formData.federalTaxId,
          
          // Principal Contact
          contact_name: formData.contactName,
          contact_title: formData.contactTitle,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          business_address: formData.businessAddress,
          city_state_zip: formData.cityStateZip,
          
          // Experience & Expertise
          steel_frame_experience: formData.steelFrameExperience,
          barndominiums_completed: formData.barndominiumsCompleted,
          expertise: formData.expertise,
          
          // Project History
          projects: formData.projects,
          
          // Building Standards
          building_standards: formData.buildingStandards,
          
          // Additional Information
          additional_info: formData.additionalInfo,
          
          submitted_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to save application data' },
        { status: 500 }
      );
    }

    console.log('Database insertion complete');
    console.log('Builder application submitted successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully! We will review your application and contact you soon.',
      id: data[0].id
    });

  } catch (error: unknown) {
    console.error('Detailed server error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Error submitting application: ${error instanceof Error ? error.message : 'Unknown error occurred'}` 
      },
      { status: 500 }
    );
  }
}
