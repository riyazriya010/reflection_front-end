"use client"

import adminApi from '@/app/api/admin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating' | 'scale';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  anonymous: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface DynamicForm {
  _id?: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function DynamicForm() {
  const router = useRouter()
  const [form, setForm] = useState<DynamicForm>({
    title: '',
    description: '',
    fields: []
  });
  const [currentField, setCurrentField] = useState<FormField>({
    id: uuidv4(),
    type: 'text',
    label: '',
    required: false,
    anonymous: false
  });

  const addField = () => {
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, currentField]
    }));
    setCurrentField({
      id: uuidv4(),
      type: 'text',
      label: '',
      required: false,
      anonymous: false
    });
  };

  const removeField = (id: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || form.fields.length === 0) {
        alert('Form title and at least one field are required');
        return;
      }

      const formData = {
        title: form.title,
        description: form.description,
        fields: form.fields.map(field => ({
          type: field.type,
          label: field.label,
          required: field.required,
          anonymous: field.anonymous,
          ...(field.options && { options: field.options }),
          ...(field.min !== undefined && { min: field.min }),
          ...(field.max !== undefined && { max: field.max }),
          ...(field.step !== undefined && { step: field.step })
        }))
      };

      const response = await adminApi.dynamicForm(formData);
      console.log('Form created:', response);

      alert('Form saved successfully!');
      setForm({
        title: '',
        description: '',
        fields: []
      });
    } catch (error: any) {
      console.error('Error saving form:', error);
      console.log(error)
      if (error && error.response?.status === 401) {
        toast.warn(error.response?.data?.message)
      }
    }
  };


  const handleLogout = async () => {
    const response = await adminApi.logout()
    if (response.data.success) {
      router.replace('/pages/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 sm:p-10 text-white">
      <div className="max-w-4xl mx-auto">
        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />
        <div className='flex justify-between mb-4'>
          <h1 className="text-2xl font-bold mb-6">Create Dynamic Feedback Form</h1>
          <button
            className='bg-red-600 border-8 border-red-700 rounded-[22px] h-12 w-20 text-white'
            onClick={() => handleLogout()}
          >Logout</button>
        </div>

        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Form Title</label>
            <input
              type="text"
              className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Form Fields</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Field Type</label>
              <select
                className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                value={currentField.type}
                onChange={(e) => setCurrentField({ ...currentField, type: e.target.value as FieldType })}
              >
                <option value="text" className="bg-[#2c2c2c]">Text Input</option>
                <option value="textarea" className="bg-[#2c2c2c]">Text Area</option>
                <option value="radio" className="bg-[#2c2c2c]">Radio Buttons</option>
                <option value="checkbox" className="bg-[#2c2c2c]">Checkboxes</option>
                <option value="select" className="bg-[#2c2c2c]">Dropdown</option>
                <option value="rating" className="bg-[#2c2c2c]">Rating</option>
                <option value="scale" className="bg-[#2c2c2c]">Scale</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Field Label</label>
              <input
                type="text"
                className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                value={currentField.label}
                onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </div>
          </div>

          {['radio', 'checkbox', 'select'].includes(currentField.type) && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Options (comma separated)</label>
              <input
                type="text"
                className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                placeholder="Option 1, Option 2, Option 3"
                onChange={(e) => {
                  const options = e.target.value.split(',').map(opt => opt.trim());
                  setCurrentField({ ...currentField, options });
                }}
              />
            </div>
          )}

          {currentField.type === 'scale' && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Min Value</label>
                <input
                  type="number"
                  className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                  value={currentField.min || 1}
                  onChange={(e) => setCurrentField({ ...currentField, min: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Max Value</label>
                <input
                  type="number"
                  className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                  value={currentField.max || 5}
                  onChange={(e) => setCurrentField({ ...currentField, max: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Step</label>
                <input
                  type="number"
                  className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white"
                  value={currentField.step || 1}
                  onChange={(e) => setCurrentField({ ...currentField, step: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={currentField.required}
                onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="required" className="text-gray-300">Required</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={currentField.anonymous}
                onChange={(e) => setCurrentField({ ...currentField, anonymous: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="anonymous" className="text-gray-300">Anonymous Response</label>
            </div>
          </div>

          <button
            onClick={addField}
            className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition"
          >
            Add Field
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
          <h3 className="text-lg font-medium mb-2">{form.title || 'Untitled Form'}</h3>
          <p className="text-gray-400 mb-4">{form.description || 'No description'}</p>

          {form.fields.length === 0 ? (
            <p className="text-gray-500">No fields added yet</p>
          ) : (
            <div className="space-y-4">
              {form.fields.map((field) => (
                <div key={field.id} className="border border-[#3a3a3a] p-4 rounded-lg relative">
                  <button
                    onClick={() => removeField(field.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>

                  <label className="block text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                    {field.anonymous && <span className="ml-2 text-sm text-gray-500">(Anonymous)</span>}
                  </label>

                  {renderFieldPreview(field)}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.title || form.fields.length === 0}
          className="bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-600 disabled:text-gray-400"
        >
          Save Form
        </button>
      </div>
    </div>
  );
}

function renderFieldPreview(field: FormField) {
  switch (field.type) {
    case 'text':
      return <input type="text" className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white" disabled />;
    case 'textarea':
      return <textarea className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white" rows={3} disabled />;
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((option, i) => (
            <div key={i} className="flex items-center">
              <input type="radio" id={`${field.id}-${i}`} name={field.id} className="mr-2" disabled />
              <label htmlFor={`${field.id}-${i}`} className="text-gray-300">{option}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option, i) => (
            <div key={i} className="flex items-center">
              <input type="checkbox" id={`${field.id}-${i}`} className="mr-2" disabled />
              <label htmlFor={`${field.id}-${i}`} className="text-gray-300">{option}</label>
            </div>
          ))}
        </div>
      );
    case 'select':
      return (
        <select className="w-full p-2 border border-[#3a3a3a] bg-[#2c2c2c] rounded text-white" disabled>
          <option value="">Select an option</option>
          {field.options?.map((option, i) => (
            <option key={i} value={option} className="bg-[#2c2c2c]">{option}</option>
          ))}
        </select>
      );
    case 'rating':
      return (
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} className="text-2xl text-yellow-400" disabled>★</button>
          ))}
        </div>
      );
    case 'scale':
      return (
        <div className="flex items-center justify-between text-gray-300">
          <span>{field.min || 1}</span>
          <input
            type="range"
            min={field.min || 1}
            max={field.max || 5}
            step={field.step || 1}
            className="mx-2 flex-grow"
            disabled
          />
          <span>{field.max || 5}</span>
        </div>
      );
    default:
      return null;
  }
}