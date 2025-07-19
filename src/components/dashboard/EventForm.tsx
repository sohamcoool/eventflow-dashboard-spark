import React, { useState } from 'react';
import { Calendar, MapPin, Users, Upload, X } from 'lucide-react';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  expiryDate: string;
  location: string;
  maxAttendees: number;
  image?: string;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<Event>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    expiryDate: event?.expiryDate || '',
    location: event?.location || '',
    maxAttendees: event?.maxAttendees || 50,
    image: event?.image || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Event, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.maxAttendees < 1) newErrors.maxAttendees = 'Must allow at least 1 attendee';
    
    // Validate that expiry date is after event date
    if (formData.date && formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.date)) {
      newErrors.expiryDate = 'Expiry date must be after event date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-xl transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="input-floating">
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder=" "
              className={errors.title ? 'border-destructive' : ''}
            />
            <label htmlFor="title">Event Title</label>
            {errors.title && (
              <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="input-floating">
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder=" "
              className={`w-full px-4 py-3 bg-input border border-border rounded-xl outline-none resize-none transition-all duration-300 ${
                errors.description ? 'border-destructive' : 'focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]'
              }`}
            />
            <label htmlFor="description">Event Description</label>
            {errors.description && (
              <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.description}</p>
            )}
          </div>

          {/* Date and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-floating">
              <input
                type="datetime-local"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={errors.date ? 'border-destructive' : ''}
              />
              <label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Date & Time
              </label>
              {errors.date && (
                <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.date}</p>
              )}
            </div>

            <div className="input-floating">
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder=" "
                className={errors.location ? 'border-destructive' : ''}
              />
              <label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {errors.location && (
                <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Expiry Date and Max Attendees Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-floating">
              <input
                type="datetime-local"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={errors.expiryDate ? 'border-destructive' : ''}
              />
              <label htmlFor="expiryDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Expiry Date
              </label>
              {errors.expiryDate && (
                <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.expiryDate}</p>
              )}
            </div>

            <div className="input-floating">
              <input
                type="number"
                id="maxAttendees"
                min="1"
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                placeholder=" "
                className={errors.maxAttendees ? 'border-destructive' : ''}
              />
              <label htmlFor="maxAttendees" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Maximum Attendees
              </label>
              {errors.maxAttendees && (
                <p className="text-destructive text-sm mt-1 animate-slide-down">{errors.maxAttendees}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Event Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors duration-300 group">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <p className="text-sm text-muted-foreground">
                <button type="button" className="text-primary hover:underline">Upload an image</button> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;