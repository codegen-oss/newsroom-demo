import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormError, FormHelperText } from './Form';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { Alert } from './Alert';

interface FormValues {
  name: string;
  email: string;
  category: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  category?: string;
  agreeToTerms?: string;
}

export const FormExample: React.FC = () => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    category: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!values.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!values.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (field: keyof FormValues, value: string | boolean) => {
    setValues({
      ...values,
      [field]: value,
    });
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setValues({
            name: '',
            email: '',
            category: '',
            agreeToTerms: false,
          });
        }, 3000);
      }, 1500);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      {submitSuccess && (
        <Alert
          variant="success"
          title="Success!"
          className="mb-4"
          onClose={() => setSubmitSuccess(false)}
        >
          Your form has been submitted successfully.
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup>
          <FormLabel htmlFor="name" required>
            Name
          </FormLabel>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            fullWidth
          />
          {errors.name && <FormError>{errors.name}</FormError>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            fullWidth
          />
          {errors.email && <FormError>{errors.email}</FormError>}
          <FormHelperText>We'll never share your email with anyone else.</FormHelperText>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="category" required>
            Category
          </FormLabel>
          <Select
            id="category"
            value={values.category}
            onChange={(value) => handleChange('category', value)}
            options={[
              { value: '', label: 'Select a category', disabled: true },
              { value: 'technology', label: 'Technology' },
              { value: 'politics', label: 'Politics' },
              { value: 'business', label: 'Business' },
              { value: 'science', label: 'Science' },
            ]}
            error={!!errors.category}
            fullWidth
          />
          {errors.category && <FormError>{errors.category}</FormError>}
        </FormGroup>
        
        <FormGroup>
          <Checkbox
            id="terms"
            checked={values.agreeToTerms}
            onChange={(checked) => handleChange('agreeToTerms', checked)}
            label="I agree to the terms and conditions"
            error={!!errors.agreeToTerms}
          />
          {errors.agreeToTerms && <FormError>{errors.agreeToTerms}</FormError>}
        </FormGroup>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          fullWidth
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

