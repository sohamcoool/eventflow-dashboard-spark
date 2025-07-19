import React from 'react';
import { Calendar, MapPin, Users, Edit, Trash2, Eye, AlertTriangle, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  expiryDate: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  image?: string;
}

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onView: (event: Event) => void;
  delay?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-success bg-success/10 border-success/20';
    case 'rejected':
      return 'text-destructive bg-destructive/10 border-destructive/20';
    case 'expired':
      return 'text-muted-foreground bg-muted/20 border-muted/40';
    default:
      return 'text-warning bg-warning/10 border-warning/20';
  }
};

const getExpiryStatus = (expiryDate: string) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'expired', message: 'Expired', color: 'text-destructive', icon: AlertTriangle };
  } else if (diffDays <= 7) {
    return { status: 'expiring', message: `${diffDays} days left`, color: 'text-warning', icon: Clock };
  } else {
    return { status: 'active', message: `${diffDays} days left`, color: 'text-muted-foreground', icon: Clock };
  }
};

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onView, 
  delay = 0 
}) => {
  return (
    <div 
      className={`card-fancy group animate-fade-in stagger-delay-${delay}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      {/* Event Image */}
      <div className="relative h-48 -m-6 mb-4 rounded-t-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)} backdrop-blur-sm`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {event.location}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-primary" />
            {event.attendees} / {event.maxAttendees} attendees
          </div>

          {/* Expiry Status */}
          <div className="flex items-center text-sm">
            {(() => {
              const expiryInfo = getExpiryStatus(event.expiryDate);
              const ExpiryIcon = expiryInfo.icon;
              return (
                <div className={`flex items-center ${expiryInfo.color}`}>
                  <ExpiryIcon className="w-4 h-4 mr-2" />
                  <span className={expiryInfo.status === 'expiring' ? 'animate-pulse font-medium' : ''}>
                    {expiryInfo.message}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Attendance Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Attendance</span>
            <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={() => onView(event)}
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 group/btn"
            >
              <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all duration-300 group/btn"
            >
              <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;