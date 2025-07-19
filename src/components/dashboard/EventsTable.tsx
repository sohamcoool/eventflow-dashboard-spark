import React, { useState } from 'react';
import { Edit, Trash2, Eye, MoreHorizontal, Calendar, MapPin, Users } from 'lucide-react';

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
}

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onView: (event: Event) => void;
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
    return { status: 'expired', message: 'Expired', color: 'text-destructive' };
  } else if (diffDays <= 7) {
    return { status: 'expiring', message: `${diffDays} days left`, color: 'text-warning' };
  } else {
    return { status: 'active', message: `${diffDays} days left`, color: 'text-muted-foreground' };
  }
};

const EventsTable: React.FC<EventsTableProps> = ({ events, onEdit, onDelete, onView }) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground">All Events</h3>
        <p className="text-sm text-muted-foreground">Manage your events and track their status</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Event</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Expiry</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Attendees</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                className={`
                  border-b border-border hover:bg-muted/20 transition-all duration-300
                  animate-slide-in-left stagger-delay-${index + 1}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="px-6 py-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const expiryInfo = getExpiryStatus(event.expiryDate);
                    return (
                      <div className={`text-sm ${expiryInfo.color} ${expiryInfo.status === 'expiring' ? 'animate-pulse font-medium' : ''}`}>
                        {expiryInfo.message}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{event.location}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-foreground">
                      {event.attendees}/{event.maxAttendees}
                    </div>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(event)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 group"
                    >
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                      onClick={() => onEdit(event)}
                      className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-300 group"
                    >
                      <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all duration-300 group"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`
              bg-muted/20 rounded-xl p-4 border border-border
              animate-slide-in-left stagger-delay-${index + 1}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2 text-primary" />
                {event.attendees}/{event.maxAttendees} attendees
              </div>
              {/* Expiry Status for Mobile */}
              <div className="flex items-center text-sm">
                {(() => {
                  const expiryInfo = getExpiryStatus(event.expiryDate);
                  return (
                    <div className={`flex items-center ${expiryInfo.color} ${expiryInfo.status === 'expiring' ? 'animate-pulse font-medium' : ''}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Expires: {expiryInfo.message}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView(event)}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Events Yet</h3>
          <p className="text-muted-foreground">Create your first event to get started!</p>
        </div>
      )}
    </div>
  );
};

export default EventsTable;