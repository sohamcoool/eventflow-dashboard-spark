import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, TrendingUp, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import EventCard from './EventCard';
import EventForm from './EventForm';
import EventsTable from './EventsTable';
import NotificationCenter from './NotificationCenter';
import { toast } from '@/hooks/use-toast';

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

interface FormEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  expiryDate: string;
  location: string;
  maxAttendees: number;
  image?: string;
}

interface DashboardContentProps {
  activeSection: string;
  userName: string;
}

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  eventId?: string;
  timestamp: Date;
  read: boolean;
}

// Sample data with expiry dates
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Advanced React Masterclass',
    description: 'Deep dive into React hooks, context, and performance optimization techniques for modern web development.',
    date: '2024-02-15T14:00:00',
    expiryDate: '2024-02-20T23:59:59',
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
    expiryDate: '2024-01-25T23:59:59', // This one is expired
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
    expiryDate: '2024-01-28T23:59:59', // This one expires soon
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
    expiryDate: '2024-03-10T23:59:59',
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check for expired/expiring events and create notifications
  useEffect(() => {
    const checkEventExpiry = () => {
      const now = new Date();
      const newNotifications: Notification[] = [];

      events.forEach(event => {
        const expiryDate = new Date(event.expiryDate);
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Mark events as expired if expiry date has passed
        if (diffDays < 0 && event.status !== 'expired') {
          setEvents(prev => prev.map(e => 
            e.id === event.id ? { ...e, status: 'expired' as const } : e
          ));
          
          newNotifications.push({
            id: `expired-${event.id}-${Date.now()}`,
            type: 'error',
            title: 'Event Expired',
            message: `Your event "${event.title}" has expired and is no longer accepting registrations.`,
            eventId: event.id,
            timestamp: now,
            read: false
          });
        }
        // Warn about events expiring in 7 days or less
        else if (diffDays <= 7 && diffDays > 0) {
          const existingWarning = notifications.find(n => 
            n.eventId === event.id && n.type === 'warning' && !n.read
          );
          
          if (!existingWarning) {
            newNotifications.push({
              id: `expiring-${event.id}-${Date.now()}`,
              type: 'warning',
              title: 'Event Expiring Soon',
              message: `Your event "${event.title}" will expire in ${diffDays} day${diffDays === 1 ? '' : 's'}.`,
              eventId: event.id,
              timestamp: now,
              read: false
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        
        // Show toast notifications for new alerts
        newNotifications.forEach(notification => {
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
        });
      }
    };

    checkEventExpiry();
    const interval = setInterval(checkEventExpiry, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [events, notifications]);

  // Calculate stats
  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === 'approved').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const expiredEvents = events.filter(e => e.status === 'expired').length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  const handleEventSubmit = async (eventData: FormEvent) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (editingEvent) {
      setEvents(prev => prev.map(e => 
        e.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id, attendees: editingEvent.attendees, status: editingEvent.status }
          : e
      ));
      
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated.",
      });
    } else {
      const newEvent: Event = { 
        ...eventData, 
        id: Date.now().toString(), 
        status: 'pending', 
        attendees: 0 
      };
      setEvents(prev => [newEvent, ...prev]);
      
      toast({
        title: "Event Created",
        description: "Your event has been created and is pending approval.",
      });
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
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
  };

  const handleEventView = (event: Event) => {
    // Implementation for viewing event details
    console.log('Viewing event:', event);
  };

  const handleNotificationRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleNotificationDismiss = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
          {/* Notification Center */}
          {notifications.filter(n => !n.read).length > 0 && (
            <NotificationCenter
              notifications={notifications.filter(n => !n.read)}
              onNotificationRead={handleNotificationRead}
              onNotificationDismiss={handleNotificationDismiss}
            />
          )}
          
          {renderWelcomeSection()}
          {renderStatsSection()}
          {renderRecentEvents()}
          
          {showEventForm && (
            <EventForm
              event={editingEvent ? {
                id: editingEvent.id,
                title: editingEvent.title,
                description: editingEvent.description,
                date: editingEvent.date,
                expiryDate: editingEvent.expiryDate,
                location: editingEvent.location,
                maxAttendees: editingEvent.maxAttendees,
                image: editingEvent.image,
              } : undefined}
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
              event={editingEvent ? {
                id: editingEvent.id,
                title: editingEvent.title,
                description: editingEvent.description,
                date: editingEvent.date,
                expiryDate: editingEvent.expiryDate,
                location: editingEvent.location,
                maxAttendees: editingEvent.maxAttendees,
                image: editingEvent.image,
              } : undefined}
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
          
          {/* Add expired events stat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="card-fancy">
              <h3 className="text-lg font-semibold mb-4 text-destructive">Expired Events</h3>
              <div className="text-3xl font-bold text-destructive">{expiredEvents}</div>
              <p className="text-sm text-muted-foreground mt-2">Events that have passed their expiry date</p>
            </div>
            <div className="card-fancy">
              <h3 className="text-lg font-semibold mb-4">Active Notifications</h3>
              <div className="text-3xl font-bold text-warning">{notifications.filter(n => !n.read).length}</div>
              <p className="text-sm text-muted-foreground mt-2">Unread notifications</p>
            </div>
            <div className="card-fancy">
              <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
              <div className="text-3xl font-bold text-success">
                {totalEvents > 0 ? Math.round((approvedEvents / totalEvents) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">Event approval rate</p>
            </div>
          </div>
          
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
          {/* Notification Center */}
          {notifications.filter(n => !n.read).length > 0 && (
            <NotificationCenter
              notifications={notifications.filter(n => !n.read)}
              onNotificationRead={handleNotificationRead}
              onNotificationDismiss={handleNotificationDismiss}
            />
          )}
          
          {renderWelcomeSection()}
          {renderStatsSection()}
          {renderRecentEvents()}
        </div>
      );
  }
};

export default DashboardContent;