import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

interface Project {
  location: string;
  squareFootage: string;
  completionDate: string;
  projectValue: string;
  referenceContact: string;
}

function formatCheckboxSection(data: Record<string, boolean>, title: string) {
  const selectedItems = Object.entries(data)
    .filter(([, value]) => value)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
    .join(', ');
  
  return selectedItems.length > 0 ? 
    `<p><strong>${title}:</strong> ${selectedItems}</p>` : 
    `<p><strong>${title}:</strong> None selected</p>`;
}

export async function POST(
  request: Request
): Promise<NextResponse> {
  try {
    const formData = await request.json();

    await client.connect();
    const db = client.db("builder-applications");
    
    const result = await db.collection('submissions').insertOne({
      ...formData,
      submittedAt: new Date()
    });

    // Create comprehensive email HTML
    const emailHtml = `
      <h1>New Builder Network Application</h1>
      
      <h2>Company Information</h2>
      <p><strong>Legal Business Name:</strong> ${formData.legalBusinessName}</p>
      <p><strong>DBA:</strong> ${formData.dba || 'N/A'}</p>
      <p><strong>Years in Business:</strong> ${formData.yearsInBusiness}</p>
      <p><strong>Contractor's License:</strong> ${formData.contractorLicense}</p>
      <p><strong>Federal Tax ID:</strong> ${formData.federalTaxId}</p>
      
      <h2>Principal Contact</h2>
      <p><strong>Name:</strong> ${formData.contactName}</p>
      <p><strong>Title:</strong> ${formData.contactTitle}</p>
      <p><strong>Phone:</strong> ${formData.contactPhone}</p>
      <p><strong>Email:</strong> ${formData.contactEmail}</p>
      <p><strong>Address:</strong> ${formData.businessAddress}</p>
      <p><strong>City/State/ZIP:</strong> ${formData.cityStateZip}</p>
      
      <h2>Experience & Expertise</h2>
      <p><strong>Steel Frame Experience:</strong> ${formData.steelFrameExperience} years</p>
      <p><strong>Barndominiums Completed:</strong> ${formData.barndominiumsCompleted}</p>
      ${formatCheckboxSection(formData.expertise, 'Areas of Expertise')}
      
      <h2>Project History</h2>
      ${(formData.projects as Project[]).map((project: Project, index: number) => `
        <h3>Project ${index + 1}</h3>
        <p><strong>Location:</strong> ${project.location}</p>
        <p><strong>Square Footage:</strong> ${project.squareFootage}</p>
        <p><strong>Completion Date:</strong> ${project.completionDate}</p>
        <p><strong>Project Value:</strong> ${project.projectValue}</p>
        <p><strong>Reference Contact:</strong> ${project.referenceContact}</p>
      `).join('')}
      
      <h2>Building Standards</h2>
      ${formatCheckboxSection(formData.buildingStandards, 'Building Standards & Practices')}
      
      <h2>Additional Information</h2>
      <p>${formData.additionalInfo || 'No additional information provided.'}</p>

      <p><strong>Database ID:</strong> ${result.insertedId}</p>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email notification
    await sgMail.send({
      to: 'mitchell@barnhaussteelbuilders.com',
      from: 'mitchell@barnhaussteelbuilders.com',
      subject: `New Builder Application: ${formData.legalBusinessName}`,
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting application' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}