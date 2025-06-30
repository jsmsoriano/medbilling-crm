
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard,
  Check,
  ChevronRight
} from 'lucide-react';

const MobileSettings = () => {
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
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveCompany = () => {
    toast({
      title: "Company Updated",
      description: "Company information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-3">
            <User className="w-4 h-4" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex flex-col items-center gap-1 py-3">
            <Building2 className="w-4 h-4" />
            <span className="text-xs">Company</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-3">
            <Bell className="w-4 h-4" />
            <span className="text-xs">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="mobile-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="mobile-input"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="mobile-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm">Job Title</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full mobile-button">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="mobile-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-4 h-4" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="companyName" className="text-sm">Company Name</Label>
                <Input
                  id="companyName"
                  value={company.name}
                  onChange={(e) => setCompany({...company, name: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-sm">Address</Label>
                <Input
                  id="address"
                  value={company.address}
                  onChange={(e) => setCompany({...company, address: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-sm">City</Label>
                  <Input
                    id="city"
                    value={company.city}
                    onChange={(e) => setCompany({...company, city: e.target.value})}
                    className="mobile-input"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state" className="text-sm">State</Label>
                  <Input
                    id="state"
                    value={company.state}
                    onChange={(e) => setCompany({...company, state: e.target.value})}
                    className="mobile-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="zipCode" className="text-sm">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={company.zipCode}
                  onChange={(e) => setCompany({...company, zipCode: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyPhone" className="text-sm">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={company.phone}
                  onChange={(e) => setCompany({...company, phone: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyEmail" className="text-sm">Email Address</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={company.email}
                  onChange={(e) => setCompany({...company, email: e.target.value})}
                  className="mobile-input"
                />
              </div>

              <Button onClick={handleSaveCompany} className="w-full mobile-button">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-4 h-4" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">SMS Alerts</Label>
                    <p className="text-xs text-gray-600">Critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">Dashboard Alerts</Label>
                    <p className="text-xs text-gray-600">Show alerts on dashboard</p>
                  </div>
                  <Switch
                    checked={notifications.dashboard}
                    onCheckedChange={(checked) => setNotifications({...notifications, dashboard: checked})}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">Report Notifications</Label>
                    <p className="text-xs text-gray-600">Notify when reports are ready</p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                  />
                </div>

                <Button onClick={handleSaveNotifications} className="w-full mobile-button">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-4 h-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full mobile-button">
                  Change Password
                </Button>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-600">Extra security layer</p>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                    Not Enabled
                  </Badge>
                </div>
                
                <Button variant="outline" className="w-full mobile-button">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">Professional Plan</h3>
                      <p className="text-xs text-blue-700">$99/month • Billed annually</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next billing</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment method</span>
                    <span className="font-medium">**** 1234</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full mobile-button text-sm">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full mobile-button text-sm">
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileSettings;
