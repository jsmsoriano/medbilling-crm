
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building, 
  Mail, 
  Database, 
  Bell, 
  Shield,
  Palette,
  Download
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mailchimpApiKey, setMailchimpApiKey] = useState('');
  const [practiceSettings, setPracticeSettings] = useState({
    name: 'Excel Medical Billing',
    email: 'admin@excelmedical.com',
    phone: '(555) 123-4567',
    address: '123 Medical Plaza, Suite 100'
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
    setLoading(false);
  };

  const handleMailchimpTest = async () => {
    if (!mailchimpApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Mailchimp API key to test the connection.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Connection Successful",
      description: "Mailchimp integration is working properly.",
    });
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your personal account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@excelmedical.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
              </div>
              <Button onClick={() => handleSaveSettings('Account')} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Practice Settings
              </CardTitle>
              <CardDescription>
                Configure your medical practice information and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="practiceName">Practice Name</Label>
                <Input 
                  id="practiceName" 
                  value={practiceSettings.name}
                  onChange={(e) => setPracticeSettings({...practiceSettings, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practiceEmail">Practice Email</Label>
                <Input 
                  id="practiceEmail" 
                  type="email"
                  value={practiceSettings.email}
                  onChange={(e) => setPracticeSettings({...practiceSettings, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practicePhone">Practice Phone</Label>
                <Input 
                  id="practicePhone" 
                  type="tel"
                  value={practiceSettings.phone}
                  onChange={(e) => setPracticeSettings({...practiceSettings, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practiceAddress">Practice Address</Label>
                <Input 
                  id="practiceAddress"
                  value={practiceSettings.address}
                  onChange={(e) => setPracticeSettings({...practiceSettings, address: e.target.value})}
                />
              </div>
              <Button onClick={() => handleSaveSettings('Practice')} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Mailchimp Integration
                </CardTitle>
                <CardDescription>
                  Connect your Mailchimp account for email marketing and client communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mailchimpKey">Mailchimp API Key</Label>
                  <Input 
                    id="mailchimpKey" 
                    type="password"
                    placeholder="Enter your Mailchimp API key"
                    value={mailchimpApiKey}
                    onChange={(e) => setMailchimpApiKey(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveSettings('Mailchimp')} disabled={loading}>
                    {loading ? 'Saving...' : 'Save API Key'}
                  </Button>
                  <Button variant="outline" onClick={handleMailchimpTest} disabled={loading}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Supabase Backend
                </CardTitle>
                <CardDescription>
                  Configure your Supabase database connection and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    To enable Supabase backend functionality, click the green Supabase button in the top right corner 
                    of the interface to connect your project to Supabase.
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Configure Supabase (Connect first)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="claimAlerts">Claim Status Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified when claim status changes</p>
                  </div>
                  <Switch id="claimAlerts" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                    <p className="text-sm text-gray-600">Notifications for received payments</p>
                  </div>
                  <Switch id="paymentAlerts" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                  </div>
                  <Switch id="weeklyReports" />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('Notifications')} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="mt-1" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSaveSettings('Security')} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button variant="outline">
                  Setup 2FA
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
