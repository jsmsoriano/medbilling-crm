
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DataSourceConfiguration from '@/components/settings/DataSourceConfiguration';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard, 
  Users, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check,
  X,
  Database
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    dashboard: true,
    reports: true
  });

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@excellbilling.com',
    phone: '(555) 123-4567',
    title: 'Billing Manager'
  });

  const [company, setCompany] = useState({
    name: 'Excel Billing Services',
    address: '123 Business Center Dr',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '(555) 987-6543',
    email: 'contact@excellbilling.com'
  });

  const handleSaveProfile = () => {
    // Basic validation
    if (!profile.firstName || !profile.lastName || !profile.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 500);
  };

  const handleSaveCompany = () => {
    // Basic validation
    if (!company.name || !company.address || !company.city) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required company fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Company Updated",
        description: "Company information has been saved successfully.",
      });
    }, 500);
  };

  const handleSaveNotifications = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 500);
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here.",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "2FA setup would be implemented here.",
    });
  };

  return (
    <div className="space-y-6 p-3 md:p-6 max-w-full overflow-x-hidden">
      <div className="text-center w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Manage your account, preferences, and system configuration</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-max grid-cols-6 h-auto md:h-10">
            <TabsTrigger value="profile" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <User className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <Building2 className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <Database className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="hidden md:inline">Data Sources</span>
              <span className="md:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <Bell className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="hidden md:inline">Notifications</span>
              <span className="md:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <Shield className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-0 text-xs md:text-sm px-2">
              <CreditCard className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={company.name}
                  onChange={(e) => setCompany({...company, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={company.address}
                  onChange={(e) => setCompany({...company, address: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={company.city}
                    onChange={(e) => setCompany({...company, city: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={company.state}
                    onChange={(e) => setCompany({...company, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={company.zipCode}
                    onChange={(e) => setCompany({...company, zipCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={company.phone}
                    onChange={(e) => setCompany({...company, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({...company, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCompany}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-sources">
          <DataSourceConfiguration />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dashboard Alerts</Label>
                    <p className="text-sm text-gray-600">Show alerts on the dashboard</p>
                  </div>
                  <Switch
                    checked={notifications.dashboard}
                    onCheckedChange={(checked) => setNotifications({...notifications, dashboard: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Report Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified when reports are ready</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Password & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleChangePassword}>
                  Change Password
                </Button>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    Not Enabled
                  </Badge>
                </div>
                
                <Button variant="outline" className="w-full" onClick={handleEnable2FA}>
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600">Chrome on Windows • San Francisco, CA</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Professional Plan</h3>
                    <p className="text-sm text-blue-700">$99/month • Billed annually</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Next billing date</span>
                  <span className="font-medium">January 15, 2024</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Payment method</span>
                  <span className="font-medium">**** **** **** 1234</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
