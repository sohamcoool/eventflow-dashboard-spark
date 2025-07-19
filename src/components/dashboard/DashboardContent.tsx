import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, TrendingUp, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import EventCard from './EventCard';
import EventForm from './EventForm';
import EventsTable from './EventsTable';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: 'pending' | 'approved' | 'rejected';
  image?: string;
}

interface DashboardContentProps {
  activeSection: string;
  userName: string;
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Advanced React Masterclass',
    description: 'Deep dive into React hooks, context, and performance optimization techniques for modern web development.',
    date: '2024-02-15T14:00:00',
    location: 'Tech Hub Convention Center',
    attendees: 85,
    maxAttendees: 100,
    status: 'approved'
  },
  {
    id: '2', 
    title: 'UI/UX Design Workshop',
    description: 'Learn the fundamentals of user experience design and create stunning user interfaces.',
    date: '2024-02-20T10:00:00',
    location: 'Creative Arts Studio',
    attendees: 42,
    maxAttendees: 60,
    status: 'pending'
  },
  {
    id: '3',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis and machine learning applications.',
    date: '2024-02-25T09:00:00',
    location: 'University Auditorium',
    attendees: 120,
    maxAttendees: 150,
    status: 'approved'
  },
  {
    id: '4',
    title: 'Digital Marketing Bootcamp',
    description: 'Complete guide to modern digital marketing strategies and tools.',
    date: '2024-03-01T13:00:00',
    location: 'Business Center Plaza',
    attendees: 0,
    maxAttendees: 80,
    status: 'rejected'
  }
];

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection, userName }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate stats
  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === 'approved').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  const handleEventSubmit = async (eventData: Event) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : e));
    } else {
      const newEvent = { ...eventData, id: Date.now().toString(), status: 'pending' as const, attendees: 0 };
      setEvents(prev => [newEvent, ...prev]);
    }
    
    setIsLoading(false);
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleEventView = (event: Event) => {
    // Implementation for viewing event details
    console.log('Viewing event:', event);
  };

  const renderWelcomeSection = () => (
    <div className="mb-8 animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 border border-border">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{userName}</span>! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to create amazing learning experiences? Your dashboard is looking great today.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
      </div>
    </div>
  );

  const renderStatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events"
        value={totalEvents}
        subtitle="All time"
        icon={Calendar}
        trend={{ value: 12, isPositive: true }}
        delay={1}
      />
      <StatsCard
        title="Approved Events"
        value={approvedEvents}
        subtitle="Ready to go"
        icon={TrendingUp}
        trend={{ value: 8, isPositive: true }}
        delay={2}
      />
      <StatsCard
        title="Pending Approval"
        value={pendingEvents}
        subtitle="Awaiting review"
        icon={Clock}
        delay={3}
      />
      <StatsCard
        title="Total Attendees"
        value={totalAttendees}
        subtitle="Across all events"
        icon={Users}
        trend={{ value: 25, isPositive: true }}
        delay={4}
      />
    </div>
  );

  const renderRecentEvents = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recent Events</h2>
          <p className="text-muted-foreground">Your latest created events</p>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 3).map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEventEdit}
            onDelete={handleEventDelete}
            onView={handleEventView}
            delay={index + 1}
          />
        ))}
      </div>
    </div>
  );

  switch (activeSection) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          {renderWelcomeSection()}
          {renderStatsSection()}
          {renderRecentEvents()}
          
          {showEventForm && (
            <EventForm
              event={editingEvent}
              onSubmit={handleEventSubmit}
              onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(undefined);
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      );

    case 'create-event':
      return (
        <div className="space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Event</h1>
            <p className="text-muted-foreground mb-8">Fill in the details to create your new learning event</p>
          </div>
          
          <EventForm
            onSubmit={handleEventSubmit}
            onCancel={() => {}}
            isLoading={isLoading}
          />
        </div>
      );

    case 'my-events':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Events</h1>
              <p className="text-muted-foreground">Manage all your events in one place</p>
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>

          <EventsTable
            events={events}
            onEdit={handleEventEdit}
            onDelete={handleEventDelete}
            onView={handleEventView}
          />

          {showEventForm && (
            <EventForm
              event={editingEvent}
              onSubmit={handleEventSubmit}
              onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(undefined);
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      );

    case 'analytics':
      return (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground mb-8">Track your event performance and engagement</p>
          </div>
          
          {renderStatsSection()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-fancy">
              <h3 className="text-lg font-semibold mb-4">Event Performance</h3>
              <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Chart coming soon...</p>
              </div>
            </div>
            <div className="card-fancy">
              <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
              <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Chart coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your account and preferences</p>
          </div>
          
          <div className="card-fancy max-w-2xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{userName}</h3>
                  <p className="text-muted-foreground">Course Provider</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-floating">
                  <input type="text" value={userName} placeholder=" " />
                  <label>Full Name</label>
                </div>
                <div className="input-floating">
                  <input type="email" value="provider@example.com" placeholder=" " />
                  <label>Email Address</label>
                </div>
              </div>
              
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-6">
          {renderWelcomeSection()}
          {renderStatsSection()}
          {renderRecentEvents()}
        </div>
      );
  }
};

export default DashboardContent;