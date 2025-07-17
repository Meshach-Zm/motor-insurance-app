'use client'
import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Star
} from 'lucide-react';

// Type Definitions
type FormData = {
  make: string;
  model: string;
  year: string;
  vin: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  licenseNumber: string;
  yearsLicensed: string;
  accidents: string;
  violations: string;
};

type ValidationErrors = {
  [key in keyof FormData]?: string;
};

type Option = {
  value: string;
  label: string;
};

type Plan = {
  name: string;
  price: number;
  features: string[];
};

// Skeleton Loader Component
const SkeletonLoader = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
);

// Loading Skeleton for form fields
const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-24" />
      <SkeletonLoader className="h-12 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-32" />
      <SkeletonLoader className="h-12 w-full" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-28" />
      <SkeletonLoader className="h-12 w-full" />
    </div>
  </div>
);

// Quote Results Skeleton
const QuoteSkeleton = () => (
  <div className="space-y-4">
    <SkeletonLoader className="h-32 w-full" />
    <SkeletonLoader className="h-32 w-full" />
    <SkeletonLoader className="h-32 w-full" />
  </div>
);

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Input Component with validation
const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  icon: Icon,
  error
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className={`absolute left-3 top-3 w-5 h-5 ${error ? 'text-red-500' : 'text-gray-400'}`} />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-gray-800 text-white placeholder-gray-400`}
        required={required}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Select Component with validation
const Select = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false, 
  icon: Icon,
  error
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className={`absolute left-3 top-3 w-5 h-5 ${error ? 'text-red-500' : 'text-gray-400'} z-10`} />}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-gray-800 text-white appearance-none`}
        required={required}
      >
        <option value="" className="text-gray-400">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-white bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Quote Card Component
const QuoteCard = ({ plan, isRecommended = false, onSelect }: { plan: Plan; isRecommended?: boolean; onSelect: () => void }) => (
  <div
    onClick={onSelect}
    className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gray-800
      ${isRecommended
        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
        : 'border-gray-700 hover:shadow-lg hover:shadow-gray-900/50 hover:border-gray-600'}
    `}
  >
    {isRecommended && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <Star className="w-4 h-4" /> Recommended
        </span>
      </div>
    )}
    
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
      <div className="text-3xl font-bold text-blue-400 mb-4">
        ${plan.price}
        <span className="text-sm text-gray-400 font-normal">/month</span>
      </div>
      
      <ul className="space-y-2 text-sm text-gray-300 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
        isRecommended 
          ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg' 
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`}>
        Select Plan
      </button>
    </div>
  </div>
);

// Main App Component with Form Validation
const MotorInsuranceApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: '',
    vin: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    yearsLicensed: '',
    accidents: '',
    violations: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Check if current step has all required fields filled
  const isCurrentStepValid = () => {
    const currentYear = new Date().getFullYear();
    
    switch (currentStep) {
      case 1:
        return formData.make && 
               formData.model && 
               formData.year && 
               formData.vin &&
               formData.vin.length === 17 &&
               parseInt(formData.year) >= 1980 && 
               parseInt(formData.year) <= currentYear + 1;
      
      case 2:
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        const phoneValid = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone);
        const birthDate = new Date(formData.dateOfBirth);
        const age = currentYear - birthDate.getFullYear();
        
        return formData.firstName && 
               formData.lastName && 
               formData.email && 
               emailValid &&
               formData.phone && 
               phoneValid &&
               formData.dateOfBirth && 
               age >= 16;
      
      case 3:
        const zipValid = /^\d{5}(-\d{4})?$/.test(formData.zipCode);
        return formData.address && 
               formData.city && 
               formData.state && 
               formData.zipCode && 
               zipValid;
      
      case 4:
        return formData.licenseNumber && 
               formData.yearsLicensed && 
               formData.accidents && 
               formData.violations;
      
      default:
        return true;
    }
  };

  // Validation functions
  const validateStep = () => {
    const newErrors: ValidationErrors = {};
    const currentYear = new Date().getFullYear();
    
    switch (currentStep) {
      case 1:
        if (!formData.make) newErrors.make = 'Make is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.year) {
          newErrors.year = 'Year is required';
        } else if (parseInt(formData.year) < 1980 || parseInt(formData.year) > currentYear + 1) {
          newErrors.year = `Year must be between 1980 and ${currentYear + 1}`;
        }
        if (!formData.vin) {
          newErrors.vin = 'VIN is required';
        } else if (formData.vin.length !== 17) {
          newErrors.vin = 'VIN must be 17 characters';
        }
        break;
      
      case 2:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone) {
          newErrors.phone = 'Phone is required';
        } else if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number';
        }
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          const birthDate = new Date(formData.dateOfBirth);
          const age = currentYear - birthDate.getFullYear();
          if (age < 16) newErrors.dateOfBirth = 'Must be at least 16 years old';
        }
        break;
      
      case 3:
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Invalid ZIP code';
        }
        break;
      
      case 4:
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
        if (!formData.yearsLicensed) newErrors.yearsLicensed = 'Years licensed is required';
        if (!formData.accidents) newErrors.accidents = 'Please select accidents history';
        if (!formData.violations) newErrors.violations = 'Please select violations history';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setLoading(false);
    }, 1500);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleQuoteSelect = (plan: Plan) => {
    alert(`Selected: ${plan.name} - $${plan.price}/month`);
  };

  const carMakes: Option[] = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'ford', label: 'Ford' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'audi', label: 'Audi' }
  ];

  const states: Option[] = [
    { value: 'ca', label: 'California' },
    { value: 'ny', label: 'New York' },
    { value: 'tx', label: 'Texas' },
    { value: 'fl', label: 'Florida' },
    { value: 'il', label: 'Illinois' }
  ];

  const quotes: Plan[] = [
    {
      name: 'Basic Coverage',
      price: 89,
      features: ['Liability Coverage', 'State Minimum Requirements', '24/7 Claims Support', 'Online Account Management']
    },
    {
      name: 'Standard Coverage',
      price: 142,
      features: ['Comprehensive Coverage', 'Collision Coverage', 'Roadside Assistance', 'Rental Car Coverage', 'Glass Coverage']
    },
    {
      name: 'Premium Coverage',
      price: 198,
      features: ['Full Coverage', 'Gap Insurance', 'New Car Replacement', 'Accident Forgiveness', 'Vanishing Deductible']
    }
  ];

  const renderStepContent = () => {
    if (loading) {
      return <FormSkeleton />;
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Car className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Vehicle Information</h2>
              <p className="text-gray-400">Tell us about your vehicle</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Make"
                value={formData.make}
                onChange={(e) => updateFormData('make', e.target.value)}
                options={carMakes}
                required
                icon={Car}
                error={errors.make}
              />
              <Input
                label="Model"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
                placeholder="e.g., Camry, Accord"
                required
                error={errors.model}
              />
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => updateFormData('year', e.target.value)}
                placeholder="2020"
                required
                icon={Calendar}
                error={errors.year}
              />
              <Input
                label="VIN"
                value={formData.vin}
                onChange={(e) => updateFormData('vin', e.target.value)}
                placeholder="17-character VIN"
                required
                error={errors.vin}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
              <p className="text-gray-400">Help us get to know you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                placeholder="John"
                required
                icon={User}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                placeholder="Doe"
                required
                error={errors.lastName}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="john@example.com"
                required
                icon={Mail}
                error={errors.email}
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="(555) 123-4567"
                required
                icon={Phone}
                error={errors.phone}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                required
                icon={Calendar}
                error={errors.dateOfBirth}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Address Information</h2>
              <p className="text-gray-400">Where do you live?</p>
            </div>
            
            <div className="space-y-6">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="123 Main Street"
                required
                icon={MapPin}
                error={errors.address}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="San Francisco"
                  required
                  error={errors.city}
                />
                <Select
                  label="State"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  options={states}
                  required
                  error={errors.state}
                />
                <Input
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  placeholder="94102"
                  required
                  error={errors.zipCode}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Driving History</h2>
              <p className="text-gray-400">Tell us about your driving experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="License Number"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                placeholder="D1234567"
                required
                icon={CreditCard}
                error={errors.licenseNumber}
              />
              <Select
                label="Years Licensed"
                value={formData.yearsLicensed}
                onChange={(e) => updateFormData('yearsLicensed', e.target.value)}
                options={[
                  { value: '0-2', label: '0-2 years' },
                  { value: '3-5', label: '3-5 years' },
                  { value: '6-10', label: '6-10 years' },
                  { value: '10+', label: '10+ years' }
                ]}
                required
                error={errors.yearsLicensed}
              />
              <Select
                label="Accidents (last 5 years)"
                value={formData.accidents}
                onChange={(e) => updateFormData('accidents', e.target.value)}
                options={[
                  { value: '0', label: 'None' },
                  { value: '1', label: '1 accident' },
                  { value: '2', label: '2 accidents' },
                  { value: '3+', label: '3+ accidents' }
                ]}
                required
                icon={AlertCircle}
                error={errors.accidents}
              />
              <Select
                label="Violations (last 5 years)"
                value={formData.violations}
                onChange={(e) => updateFormData('violations', e.target.value)}
                options={[
                  { value: '0', label: 'None' },
                  { value: '1', label: '1 violation' },
                  { value: '2', label: '2 violations' },
                  { value: '3+', label: '3+ violations' }
                ]}
                required
                error={errors.violations}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Quotes</h2>
              <p className="text-gray-400">Choose the perfect coverage for you</p>
            </div>
            
            {loading ? (
              <QuoteSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quotes.map((quote, index) => (
                  <QuoteCard
                    key={index}
                    plan={quote}
                    isRecommended={index === 1}
                    onSelect={() => handleQuoteSelect(quote)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">
              InsureQuick
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                currentStep === 1 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < 5 && (
              <button
                onClick={nextStep}
                disabled={loading || !isCurrentStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                  loading || !isCurrentStepValid()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Secure • Fast • Trusted by millions
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotorInsuranceApp;