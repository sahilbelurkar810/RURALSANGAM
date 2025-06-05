import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, Input } from '../../components/common';
import { createRequest, CreateRequestData } from '../../services';

const CreateRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRequestData>({
    requirementDescription: '',
    requiredSkills: [],
    requiredVolunteers: 1,
    timings: '',
    duration: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'requiredVolunteers' ? parseInt(value) || 1 : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.requirementDescription.trim()) {
      newErrors.requirementDescription = 'Description is required';
    }
    if (!formData.timings.trim()) {
      newErrors.timings = 'Timings are required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    if (formData.requiredVolunteers < 1) {
      newErrors.requiredVolunteers = 'At least 1 volunteer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createRequest(formData);
      navigate('/school/requests');
    } catch (error) {
      console.error('Failed to create request:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Volunteer Request
        </h1>
        <p className="text-gray-600">
          Post a new volunteer opportunity for your school.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="requirementDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Requirement Description *
            </label>
            <textarea
              id="requirementDescription"
              name="requirementDescription"
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what kind of help you need..."
              value={formData.requirementDescription}
              onChange={handleInputChange}
            />
            {errors.requirementDescription && (
              <p className="text-sm text-red-600 mt-1">{errors.requirementDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Required Volunteers *"
              type="number"
              name="requiredVolunteers"
              min="1"
              value={formData.requiredVolunteers}
              onChange={handleInputChange}
              error={errors.requiredVolunteers}
            />

            <Input
              label="Duration *"
              name="duration"
              placeholder="e.g., 2 weeks, 1 month"
              value={formData.duration}
              onChange={handleInputChange}
              error={errors.duration}
            />
          </div>

          <Input
            label="Timings *"
            name="timings"
            placeholder="e.g., Monday-Friday 9AM-5PM"
            value={formData.timings}
            onChange={handleInputChange}
            error={errors.timings}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/school/requests')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Create Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateRequest;
