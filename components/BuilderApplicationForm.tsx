"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FormField, TextInput, CheckboxGroup } from './FormComponents';

interface FormData {
  // Company Information
  legalBusinessName: string;
  dba: string;
  yearsInBusiness: string;
  contractorLicense: string;
  federalTaxId: string;
  
  // Principal Contact
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: string;
  cityStateZip: string;
  
  // Business Profile
  fullTimeEmployees: string;
  annualRevenue: string;
  projectsCompleted: string;
  serviceArea: string;
  
  // Experience & Expertise
  steelFrameExperience: string;
  barndominiumsCompleted: string;
  expertise: Record<string, boolean>;
  
  // Insurance Information
  liabilityCarrier: string;
  liabilityPolicyNumber: string;
  liabilityCoverage: string;
  workersCompCarrier: string;
  workersCompPolicy: string;
  
  // Project History
  projects: {
    location: string;
    squareFootage: string;
    completionDate: string;
    projectValue: string;
    referenceContact: string;
  }[];
  
  // Qualifications
  certifications: string[];
  
  // Building Standards
  buildingStandards: Record<string, boolean>;
  
  // References
  references: {
    name: string;
    company: string;
    phone: string;
    relationship: string;
  }[];
  
  // Additional Information
  additionalInfo: string;
}

const BuilderApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    legalBusinessName: '',
    dba: '',
    yearsInBusiness: '',
    contractorLicense: '',
    federalTaxId: '',
    contactName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: '',
    businessAddress: '',
    cityStateZip: '',
    fullTimeEmployees: '',
    annualRevenue: '',
    projectsCompleted: '',
    serviceArea: '',
    steelFrameExperience: '',
    barndominiumsCompleted: '',
    expertise: {
      licensedGeneralContractor: false,
      licensedSteelFrameSpecialist: false,
      postFrameConstruction: false,
      customHomeBuilding: false,
      designBuild: false
    },
    liabilityCarrier: '',
    liabilityPolicyNumber: '',
    liabilityCoverage: '',
    workersCompCarrier: '',
    workersCompPolicy: '',
    projects: [
      { location: '', squareFootage: '', completionDate: '', projectValue: '', referenceContact: '' },
      { location: '', squareFootage: '', completionDate: '', projectValue: '', referenceContact: '' },
      { location: '', squareFootage: '', completionDate: '', projectValue: '', referenceContact: '' }
    ],
    certifications: ['', '', ''],
    buildingStandards: {
      ibc: false,
      localCodes: false,
      energyEfficiency: false,
      steelFrameBestPractices: false,
      postFrameGuidelines: false
    },
    references: [
      { name: '', company: '', phone: '', relationship: '' },
      { name: '', company: '', phone: '', relationship: '' },
      { name: '', company: '', phone: '', relationship: '' }
    ],
    additionalInfo: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      projects: prevState.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      references: prevState.references.map((reference, i) => 
        i === index ? { ...reference, [field]: value } : reference
      )
    }));
  };

  const handleCheckboxChange = (section: string, field: string) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...(prevState[section as keyof typeof prevState] as Record<string, boolean>),
        [field]: !(prevState[section as keyof typeof prevState] as Record<string, boolean>)[field]
      }
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/submit-builder-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Submission failed');
      }
  
      alert('Application submitted successfully!');
      setCurrentStep(1);
      // Reset form data to initial state...
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the application. Please try again.');
    }
  };

  const renderCompanyInfo = () => (
    <div className="space-y-6">
      <FormField label="Legal Business Name">
        <TextInput
          name="legalBusinessName"
          value={formData.legalBusinessName}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="DBA (if applicable)">
        <TextInput
          name="dba"
          value={formData.dba}
          onChange={handleInputChange}
        />
      </FormField>
      
      <FormField label="Years in Business">
        <TextInput
          name="yearsInBusiness"
          value={formData.yearsInBusiness}
          onChange={handleInputChange}
          type="number"
          required
        />
      </FormField>
      
      <FormField label="State Contractor's License">
        <TextInput
          name="contractorLicense"
          value={formData.contractorLicense}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="Federal Tax ID">
        <TextInput
          name="federalTaxId"
          value={formData.federalTaxId}
          onChange={handleInputChange}
          required
        />
      </FormField>
    </div>
  );

  const renderExperienceExpertise = () => (
    <div className="space-y-6">
      <FormField label="Years of Experience with Steel Frame Construction">
        <TextInput
          name="steelFrameExperience"
          value={formData.steelFrameExperience}
          onChange={handleInputChange}
          type="number"
          required
        />
      </FormField>
      
      <FormField label="Number of Barndominiums Completed">
        <TextInput
          name="barndominiumsCompleted"
          value={formData.barndominiumsCompleted}
          onChange={handleInputChange}
          type="number"
          required
        />
      </FormField>
      
      <FormField label="Areas of Expertise">
        <CheckboxGroup
          section="expertise"
          options={[
            { label: "Licensed General Contractor", value: "licensedGeneralContractor" },
            { label: "Licensed Steel Frame Specialist", value: "licensedSteelFrameSpecialist" },
            { label: "Post-Frame Construction Experience", value: "postFrameConstruction" },
            { label: "Custom Home Building Experience", value: "customHomeBuilding" },
            { label: "Design-Build Experience", value: "designBuild" }
          ]}
          values={formData.expertise}
          onChange={handleCheckboxChange}
        />
      </FormField>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <FormField label="General Liability Insurance Carrier">
        <TextInput
          name="liabilityCarrier"
          value={formData.liabilityCarrier}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="Policy Number">
        <TextInput
          name="liabilityPolicyNumber"
          value={formData.liabilityPolicyNumber}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="Coverage Amount">
        <TextInput
          name="liabilityCoverage"
          value={formData.liabilityCoverage}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="Workers Compensation Carrier">
        <TextInput
          name="workersCompCarrier"
          value={formData.workersCompCarrier}
          onChange={handleInputChange}
          required
        />
      </FormField>
      
      <FormField label="Workers Comp Policy Number">
        <TextInput
          name="workersCompPolicy"
          value={formData.workersCompPolicy}
          onChange={handleInputChange}
          required
        />
      </FormField>
    </div>
  );

  const renderProjectHistory = () => (
    <div className="space-y-8">
      {formData.projects.map((project, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <h3 className="font-medium text-lg">Project {index + 1}</h3>
          
          <FormField label="Project Location">
            <TextInput
              name={`project-${index}-location`}
              value={project.location}
              onChange={(e) => handleProjectChange(index, 'location', e.target.value)}
              required
            />
          </FormField>
          
          <FormField label="Square Footage">
            <TextInput
              name={`project-${index}-squareFootage`}
              value={project.squareFootage}
              onChange={(e) => handleProjectChange(index, 'squareFootage', e.target.value)}
              type="number"
              required
            />
          </FormField>
          
          <FormField label="Completion Date">
            <TextInput
              name={`project-${index}-completionDate`}
              value={project.completionDate}
              onChange={(e) => handleProjectChange(index, 'completionDate', e.target.value)}
              type="date"
              required
            />
          </FormField>
          
          <FormField label="Project Value">
            <TextInput
              name={`project-${index}-projectValue`}
              value={project.projectValue}
              onChange={(e) => handleProjectChange(index, 'projectValue', e.target.value)}
              required
            />
          </FormField>
          
          <FormField label="Reference Contact">
            <TextInput
              name={`project-${index}-referenceContact`}
              value={project.referenceContact}
              onChange={(e) => handleProjectChange(index, 'referenceContact', e.target.value)}
              required
            />
          </FormField>
        </div>
      ))}
    </div>
  );

  const renderBuildingStandards = () => (
    <div className="space-y-6">
      <FormField label="Building Standards & Practices">
        <CheckboxGroup
          section="buildingStandards"
          options={[
            { label: "International Building Code (IBC)", value: "ibc" },
            { label: "Local Building Codes", value: "localCodes" },
            { label: "Energy Efficiency Standards", value: "energyEfficiency" },
            { label: "Steel Frame Construction Best Practices", value: "steelFrameBestPractices" },
            { label: "Post-Frame Construction Guidelines", value: "postFrameGuidelines" }
          ]}
          values={formData.buildingStandards}
          onChange={handleCheckboxChange}
        />
      </FormField>
      
      <FormField label="Additional Information">
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleInputChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          placeholder="Please describe why you would like to join the Barnhaus Steel Builders network and what unique value you can bring to our clients..."
        />
      </FormField>
    </div>
  );

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderCompanyInfo();
      case 2:
        return renderExperienceExpertise();
      case 3:
        return renderInsurance();
      case 4:
        return renderProjectHistory();
      case 5:
        return renderBuildingStandards();
      default:
        return renderCompanyInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Card className="mx-auto border-none rounded-none sm:rounded-lg sm:my-4 sm:mx-4 shadow-none sm:shadow-sm">
        <CardHeader className="border-b space-y-4 px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-40 sm:h-16 sm:w-48">
              <Image
                src="/Logo.png"
                alt="Barnhaus Steel Builders Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <CardTitle className="text-2xl sm:text-3xl">Builder Network Application</CardTitle>
              <p className="mt-2 text-sm text-gray-600">
                Join our network of qualified builders
              </p>
            </div>
          </div>
          
          <div className="w-full mt-6">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto px-1 py-2">
              {['Company Info', 'Experience', 'Insurance', 'Project History', 'Standards'].map((step, index) => (
                <button
                  key={step}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep(index + 1);
                  }}
                  className={`
                    flex-none px-3 py-1.5 text-sm rounded-full whitespace-nowrap
                    ${currentStep === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pb-24 sm:p-6 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {renderStepContent()}
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 z-10 sm:relative sm:bg-transparent sm:border-t-0 sm:p-0 sm:mt-6">
              <div className="flex justify-between max-w-4xl mx-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentStep(currentStep - 1);
                    }}
                    className="px-5 py-2.5 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}
    
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentStep(currentStep + 1);
                    }}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors ml-auto"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderApplicationForm;